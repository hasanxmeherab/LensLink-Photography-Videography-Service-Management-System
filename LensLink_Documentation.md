# LensLink

## Photography & Videography Service Management System

**Technology:** React • Node.js • Express • MongoDB

# 1. Introduction

## 1.1 Background

Photography and videography businesses often manage bookings manually
through phone calls, Facebook pages, or spreadsheets. This process
causes communication gaps, booking conflicts, and difficulty tracking
projects.

LensLink is a web-based service management system designed to digitize
the workflow of a photography service provider.

## 1.2 Problem Statement

-   No centralized booking system\
-   Difficulty managing multiple clients\
-   Lack of professional portfolio presentation\
-   Hard to track booking status

## 1.3 Proposed Solution

-   Online service browsing and booking\
-   Admin dashboard for managing requests\
-   Portfolio showcase\
-   Centralized database

# 2. Objectives

-   Easy booking platform for clients\
-   Efficient admin management\
-   Showcase previous work professionally

# 3. Technology Stack

-   Frontend: React.js\
-   Backend: Node.js + Express.js\
-   Database: MongoDB\
-   Authentication: JWT

# 4. Functional Requirements

## Service Listing

Display services with title, description and price.

## Booking System

Clients select service and date to submit booking request.

## Admin Booking Management

Admin can approve/reject bookings and update status.

## Portfolio Showcase

Admin uploads project images/videos.

## Authentication

Admin login with JWT protection.

# 5. Database Design

## Users

name, email, password, role

## Services

title, description, price

## Bookings

userId, serviceId, date, status

## Portfolio

title, mediaURL, category

# 6. Workflow

Client browses → books → admin approves → client checks status

# 7. Future Enhancements

-   Online payments (bKash/Nagad)
-   Live chat
-   Review system

# 8. Conclusion

LensLink is a practical full‑stack web app that streamlines photography
service management.
