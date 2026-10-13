# Khiders Creative Hub

Build a complete, elegant personal website for Khider Mamoun, a Sudanese programmer, writer, and independent researcher.



1. Design



- Minimal, calm, comfortable, and professional.

- Soft purple and lavender palette with a light background.

- Elegant Arabic typography and full RTL support.

- Smooth, subtle animations and transitions without excessive effects.

- Responsive on mobile, tablet, and desktop.

- Modern editorial aesthetic, avoiding generic AI-generated templates.



2. Public Website



Create these sections:



- Home: introduction and featured content.

- About Me: biography, interests, skills, and personal journey.

- Books: covers, descriptions, categories, PDF downloads, and individual book pages.

- Projects: software projects, screenshots, technologies, and links.

- Writing: articles, reflections, and quotations.

- Research: research projects, documents, and references.

- Gallery: photographs and visual work.

- Contact: social links and a functional contact form.



3. Private Admin Dashboard



The administration dashboard must use the private URL "/khider", not "/admin".



Build a fully functional, authenticated dashboard that allows me to:



- Add, edit, delete, publish, and organize books, projects, articles, research, and gallery items.

- Upload and manage images, PDF files, and other permitted media.

- Create custom pages and edit their content.

- Add, remove, hide, show, and reorder homepage sections.

- Change website text, colors, logo, navigation, and social links.

- Manage SEO settings and contact messages.

- Preview content before publishing.



Keep the dashboard separate from the public design. Do not display its URL in public navigation, links, sitemaps, or page content.



4. Technology and Security



Use Lovable with Supabase for PostgreSQL, authentication, database, and file storage.



- Implement secure administrator authentication.

- Disable public administrator registration.

- Restrict administrator access to an explicitly authorized account.

- Enforce permissions through server-side authorization and Supabase Row Level Security (RLS), not frontend checks alone.

- Protect unpublished content and private files.

- Validate uploads and form inputs.

- Never expose privileged API keys in frontend code.

- Do not allow users to grant themselves administrator privileges.



Important: A hidden URL is not a security mechanism by itself. "/khider" must still require authentication and authorization. Unauthorized visitors must not be able to access administrative data or operations.



5. Implementation Requirements



Build a working application, not a static mockup. Connect the interface to the database and storage. Ensure changes persist after refreshing the page.



Use reusable components, clean architecture, proper loading and error states, and real functionality. Do not create fake statistics or nonfunctional controls.



Start implementing immediately, prioritizing the visual design, database, authentication, and functional content management.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e8ac8a78-2b29-4bf0-9d7c-73c826b10f23).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
