UPLOAD THESE FILES/FOLDERS TO GITHUB:

- index.html
- lookbook.html
- admin.html
- assets/  (the entire folder)
- netlify/ (the entire folder)
- package.json
- netlify.toml

Do NOT upload the ZIP itself to GitHub.

Then connect the GitHub repo to Netlify.
This is required because Netlify Drop cannot run the backend function for the live progress bar.

After deploy:
- Public site: your Netlify URL
- Admin page: your Netlify URL/admin.html
- Default PIN: rockbottom

Optional safer PIN:
Netlify > Project configuration > Environment variables > add:
ADMIN_PIN = your-new-pin
Then trigger a redeploy.
