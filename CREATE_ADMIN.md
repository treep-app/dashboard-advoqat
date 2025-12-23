# Creating Admin Credentials

There are several ways to create admin credentials for the Advoqat Admin Dashboard:

## Method 1: Using the Script (Recommended)

Use the provided script to create an admin user:

```bash
cd backend
node create-admin.js admin@advoqat.com "Admin Name" super_admin
```

**Options:**
- `admin` - Regular admin user
- `super_admin` - Super admin (can create other admins)

**Example:**
```bash
node create-admin.js admin@advoqat.com "John Admin" super_admin
```

## Method 2: Direct Database Insert

Connect to your database and run:

```sql
INSERT INTO "user" (supabase_id, email, name, role)
VALUES ('admin@advoqat.com', 'admin@advoqat.com', 'Admin User', 'super_admin')
ON CONFLICT (email) 
DO UPDATE SET role = 'super_admin', name = 'Admin User';
```

## Method 3: Update Existing User

If you already have a user account, update their role:

```sql
UPDATE "user" 
SET role = 'super_admin' 
WHERE email = 'your-email@example.com';
```

## Method 4: Using the Admin Dashboard (After First Admin is Created)

Once you have a Super Admin account:
1. Log in to the dashboard
2. Navigate to "Admin Users" page
3. Create new admin users through the UI

## Login

After creating an admin user:

1. Go to: `http://localhost:3000/auth/login`
2. Enter the email you used
3. Enter any password (the backend currently accepts any password for demo purposes)
4. You'll be redirected to the dashboard

## Notes

- **Password**: Currently, the backend accepts any password for existing users (for demo purposes). In production, you should implement proper password hashing.
- **Roles**: 
  - `admin` - Can access all dashboard features
  - `super_admin` - Can access all features + create other admin users
- **First Admin**: You need to create the first admin using Method 1, 2, or 3. After that, Super Admins can create more admins through the UI.

