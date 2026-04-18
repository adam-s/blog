# adamsohn.com

Static personal site hosted on AWS. Private GitHub repo at `adam-s/blog`.

## Architecture

```
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

```
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
   ```
   ./scripts/sync-app.sh <source-project-dir> <subpath>
   # e.g. ./scripts/sync-app.sh ~/Projects/agent-capability-threshold/web reliably-incorrect
   ```
3. Add a link to `index.html`.
4. Commit and push. CI deploys.

## Deploying

**Automatic:** push to `main`. The `deploy.yml` workflow assumes an IAM role via
GitHub OIDC, runs `aws s3 sync` with `--delete`, then invalidates CloudFront.

**Manual** (from a laptop with AWS creds):
```
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

_Populated at the end of setup._

- S3 bucket: `TBD`
- CloudFront distribution ID: `TBD`
- CloudFront distribution domain: `TBD`
- CloudFront Function ARN (www redirect): `TBD`
- ACM cert ARN: `TBD`
- GitHub Actions IAM role ARN: `TBD`

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
