# Lynkks

A simple and customizable link-in-bio web application that allows users to create profiles, share important links, and track engagement in one place.

## Overview

This repository contains the source code for **_Lynnks_** a link-in-bio web application, designed to help users easily create personalized profiles where they can share all their important links. The application offers a simple interface, with options for users to manage their links, track click-throughs, and personalize their profile.

## Live Demo

Check out the live demo of the application [here](https://lynkks.vercel.app/).

## Features

- **Customizable Profile** - Users can personalize their profile with custom titles, descriptions, and profile images.
- **Unlimited Links** - Add, edit, and reorder an unlimited number of links to external websites, social media, or content.
- **Mobile-Friendly Design** - Fully responsive layout, optimized for both mobile and desktop users.
- **Link Tracking** - Monitor engagement with built-in click-through tracking for each shared link.
- **Simple User Interface** - Clean, user-friendly design that’s easy to navigate and set up.
- **Secure Authentication** - Sign in using a secure and reliable session-based authentication system, including support for Google OAuth.
- **SEO Optimized** - Optimized for search engines to improve the visibility of individual profiles.

## Techologies Used

- **Frontend & Backend**:

  - **Next.js**: Fullstack framework used for both the application's frontend, and backend APIs. It offers features such as server-side rendering, static generation, and API routes for efficient data fetching.

- **UI Components & Styling**:

  - **Radix UI**: A library of accessible, unstyled UI primitives, giving control over styling while maintaining accessibility.
  - **Tailwind CSS**: Utility-first CSS framework for rapid design and responsive layouts.

- **State Management & Forms**:

  - **React Query**: Used for managing server-side data fetching, caching, and synchronization.
  - **React Hook Form**: Lightweight library for handling forms and validation.

- **Authentication**:

  - **Session-based Authentication**: Implemented with Next.js and database sessions to securely manage user authentication.

  - **Google OAuth**: Used for implementing secure authentication via Google accounts, allowing users to log in with their existing credentials.

- **Email Service**:

  - **Nodemailer**: A module for Node.js used to send emails from the application, facilitating features such as email address verification and password reset.

- **Database**:

  - **MongoDB**: NoSQL database for storing user profiles, links, and session data.
  - **Mongoose**: ODM library to interact with MongoDB, providing schema-based data models.

- **Storage**:
  - **Firebase**: Used for secure and scalable cloud storage to handle image uploads.

<!-- ## Installation and Usage -->

## Running the Application Locally

### Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Make sure you have Node.js installed on your machine.
- **MongoDB**: You will need a MongoDB database to store user profiles and links. You can run MongoDB locally on your machine or use a cloud provider like MongoDB Atlas.
- **Firebase**: You'll need to create an account on [Firebase](https://console.firebase.google.com/) and set up a new project and obtain your Firebase configuration credentials for storage.
- **Google OAuth Credentials**: To enable Google authentication, you should create a project in the [Google Cloud Console](https://console.cloud.google.com), enable the Google OAuth API, and obtain your client ID and client secret. These credentials should be added to your `.env.local` file for proper configuration.

- **Nodemailer Configuration**: If you intend to use Nodemailer for sending emails, you may need SMTP credentials from your email provider, which should also be added to your `.env.local` file.

### Installation

1. Clone the repository

```bash
git clone https://github.com/chideraemmanuel/lynkks.git
```

2. Install dependencies

```bash
npm install
```

### Configuration

#### Environment variables

To configure the environment variables, please refer to the `.env.example` file located in the root of the project. This file contains all the necessary environment variables you need to set up. Simply create a `.env.local` file based on the example and update the values as required for your environment.

### Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Access the application: Open your web browser and go to [http://localhost:3000](http://localhost:3000) to view the application.
