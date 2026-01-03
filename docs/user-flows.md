# User Flows

Login
- Open `/login` → fill email/password → submit → success: redirect `/dashboard`; failure: error toast.

Signup
- Open `/signup` → fill username/email/password → submit → success: redirect `/login`; failure: error toast.

Dashboard
- Access `/dashboard` with valid token → view cards → quick actions → logout.

Notes
- Open `/notes` → list, create, edit, delete; success messages, error handling.

Todo
- Open `/todo` → add/update/delete → mark complete with confirm dialogs.

Price Table
- Open `/Prices-table` → select categories/units via Radix Select → view cards.

