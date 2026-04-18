# adamsohn.com

Static personal site hosted on AWS. Private GitHub repo at `adam-s/blog`.

## Architecture

```text
 Route53 (adamsohn.com.)
    |
    v
 CloudFront distribution  --(OAC)-->  S3 bucket (private)
    |                                   ^
    | (HTTPS, ACM cert us-east-1)       |
    |                                   |
  adamsohn.com                        deploys: aws s3 sync
  www.adamsohn.com -> 301 -> adamsohn.com  (CloudFront Function)
```

- **S3** stores the built site verbatim. Bucket is private; only CloudFront can read via Origin Access Control.
- **CloudFront** fronts S3, terminates HTTPS, caches globally. `www` is aliased on the same distribution and a CloudFront Function issues a 301 to the apex.
- **ACM** cert lives in `us-east-1` (CloudFront requirement), DNS-validated via Route53.
- **Route53** holds the hosted zone for `adamsohn.com` and alias A/AAAA records for apex and `www` pointing at the CloudFront distribution.

Cost: ~$0.50/month for the Route53 hosted zone. S3 + CloudFront are effectively free at this traffic level.

## Repo layout

```text
blog/
├── index.html              # Homepage (CERN-aesthetic, plain HTML)
├── reliably-incorrect/     # Built copy of agent-capability-threshold/web
├── scripts/
│   └── sync-app.sh         # Builds a source project and copies dist/ here
├── .github/workflows/
│   └── deploy.yml          # On push to main: aws s3 sync + invalidation
├── CLAUDE.md               # This file
└── .gitignore
```

**We commit built sub-apps into this repo.** The blog repo is the deployment
manifest: whatever's in `main` is what's on the site. `git log` is the deploy
history; `git revert` + redeploy rolls back. Source code for sub-apps lives in
its own repos (e.g. `agent-capability-threshold`); this repo only contains the
built `dist/` output and the homepage.

## Adding a sub-app

1. Ensure the source project's Vite config uses `base: './'` so assets resolve
   under any subpath without per-subpath rebuilds.
2. Build and copy into this repo:

   ```bash
   ./scripts/sync-app.sh <source-project-dir> <subpath>
   # e.g. ./scripts/sync-app.sh ~/Projects/agent-capability-threshold/web reliably-incorrect
   ```

3. Add a link to `index.html`.
4. Commit and push. CI deploys.

## Deploying

**Automatic:** push to `main`. The `deploy.yml` workflow assumes an IAM role via
GitHub OIDC, runs `aws s3 sync` with `--delete`, then invalidates CloudFront.

**Manual** (from a laptop with AWS creds):

```bash
aws s3 sync . s3://<bucket> --delete \
  --exclude ".git/*" --exclude ".github/*" --exclude "scripts/*" \
  --exclude "CLAUDE.md" --exclude ".gitignore" --exclude ".DS_Store"
aws cloudfront create-invalidation --distribution-id <id> --paths "/*"
```

## AWS resources

Filled in during setup; see the "Resource IDs" section at the bottom.

- AWS account: `703475444615`
- Region for S3, CloudFront Functions, IAM: `us-east-1` (CloudFront requires
  ACM certs there; keeping everything in one region avoids surprises).
- Hosted zone ID: `Z3FLDCSEVPAV8B`

### Resource IDs

- S3 bucket: `adamsohn-com-site` (private, versioning on, all public access blocked)
- CloudFront distribution ID: `E3UH28N54Y87WY`
- CloudFront distribution domain: `ddllvw9pgn4k3.cloudfront.net`
- CloudFront Function: `adamsohn-www-to-apex` (does www→apex redirect + `/foo/` → `/foo/index.html` rewrite)
- Origin Access Control ID: `EW61F5NUPW9V0`
- ACM cert ARN: `arn:aws:acm:us-east-1:703475444615:certificate/3d2a37a0-1516-4bd7-abfa-31d832c89504`
- GitHub Actions IAM role: `arn:aws:iam::703475444615:role/adamsohn-com-gha-deploy` (trusts `repo:adam-s/blog:*` via OIDC)
- Admin IAM user: `adamsohn-admin` (for local AWS CLI use; profile name `adamsohn` in `~/.aws/credentials`)

### Quick local CLI

```bash
export AWS_PROFILE=adamsohn
aws s3 ls s3://adamsohn-com-site/
aws cloudfront create-invalidation --distribution-id E3UH28N54Y87WY --paths "/*"
```

### What the CloudFront Function does

Single viewer-request function handles two jobs:

1. If `Host: www.adamsohn.com`, respond 301 to `https://adamsohn.com<uri>`.
2. Rewrite `*/` → `*/index.html` and extensionless paths → `<path>/index.html` so subdirectory sites (e.g. `/reliably-incorrect/`) serve their `index.html`. CloudFront's `DefaultRootObject` only handles the root `/`.

### Known gotchas

- **Sub-app Vite configs must use `base: './'`** (relative asset paths). Otherwise rebuild with `base: '/<subpath>/'` before syncing.
- CloudFront Function updates require `update-function` then `publish-function` — two separate calls. Publishing is ~1–2 minutes.
- `aws s3 sync --delete` will nuke anything in the bucket that isn't in the working directory. Always run from the blog repo root.

## Conventions for Claude

- **Stack**: plain HTML for the homepage. Sub-apps may be any framework; we
  only care about the built `dist/`.
- **No build step for the homepage.** Edit `index.html` directly.
- **No frameworks on the homepage.** Keep the CERN aesthetic — default fonts,
  minimal markup, bare links.
- **Commit built sub-apps.** Don't try to build at deploy time.
- **Use AWS CLI for infra.** No Terraform/CDK for a site this small. Record
  resource IDs in this file so they're discoverable.
- **Region is `us-east-1`** for everything.
