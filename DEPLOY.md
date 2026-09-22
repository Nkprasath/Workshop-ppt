# Turning comments on

The deck and the workbook let a reviewer leave comments. Without the API they are kept
in that person's own browser and nobody else sees them. With it, everyone reviewing sees
everyone else's, and you see them on your machine.

The database credential lives only in the Vercel function's environment. It is never in
the pages, because everything in a page is readable by anyone who opens it.

## Once, to set it up

**1. Rotate the Atlas password first.** The one currently in use has been pasted into
chat, so treat it as public. Atlas, Database Access, edit the user, Edit Password,
Autogenerate, Update User. Copy the new connection string.

**2. Deploy the function.**

```
npm install
npx vercel            # first run links the project
npx vercel --prod
```

Vercel picks up `api/comments.ts` on its own. Note the URL it prints, something like
`https://workshop-ppt.vercel.app`.

**3. Give it the credential.** In the Vercel dashboard, Settings, Environment Variables:

| Name | Value |
|---|---|
| `MONGODB_URI` | the rotated connection string |
| `REVIEW_ALLOWED_ORIGIN` | `https://nkprasath.github.io` |

Then redeploy so the variables are picked up: `npx vercel --prod`.

**4. Point the pages at it and rebuild.**

```
REVIEW_API_BASE="https://workshop-ppt.vercel.app" npm run build
git add docs && git commit -m "Point the pages at the comments API" && git push
```

That URL is public and belongs in the repo. The connection string does not.

## Checking it works

Open the deck, press `C`, leave a comment. The panel should say **Saved and shared**
rather than *Saved on this device*. Then open the same page in a private window: the
comment should appear there too, which it can only do by having gone through the
database.

## What it writes

Database `workshop_review`, collection `comments`. Nothing else on the cluster is
touched, so `me_os` is unaffected.

## Worth knowing

The endpoint accepts comments from anyone who finds it. That is the trade for having no
accounts. For a two week review window it is a reasonable trade, and text length and
request size are capped. If it ever gets abused, the quickest fix is to remove the
Vercel deployment: the pages fall back to storing comments locally and keep working.
