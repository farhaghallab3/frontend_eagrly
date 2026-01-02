# Egrly Project Verification Plan

## 1. System Health Check
- [x] Backend Server (Port 8000)
- [x] Frontend Server (Port 5173)
- [x] Dashboard Server (Port 3000)
- [ ] Database Connection

## 2. User Flows (Frontend)
- [ ] **Registration**: Create a new user account.
- [ ] **Login**: Log in with the new account.
- [ ] **Profile**: View and edit user profile (update name, mock avatar if possible).
- [ ] **Browse Products**: View homepage listings.
- [ ] **Search**: Search for a specific item (e.g., "laptop").
- [ ] **Post Ad (Seller)**: Create a new product listing.
    - [ ] Fill details (Title, Price, Category, Description).
    - [ ] Upload mock image (if file upload supported).
    - [ ] Submit for review.

## 3. Admin Flows (Dashboard)
- [ ] **Admin Login**: Log in as superuser/admin.
- [ ] **Dashboard Overview**: Check stats/charts load.
- [ ] **Product Management**:
    - [ ] View "Pending" products.
    - [ ] Approve the product posted in step 2.
    - [ ] Reject a test product.
- [ ] **User Management**: View user list.

## 4. End-to-End Formatting
- [ ] **Verification**: Confirm approved product appears on Frontend homepage/search.
- [ ] **Notification**: Check if user gets notification of approval (if feature exists).

## 5. UI/UX "Experience" Check
- [ ] Check for broken images.
- [ ] Check for responsive layout issues (basic check).
