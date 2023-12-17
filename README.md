# H&H Passwords
***(Note: Code isn't clean and hard to maintain, to be updated in the future)***

### Introuction
This project, created for a Cyber Security class mini-project, introduces a password manager designed to secure your data by encrypting it either within a database or a file stored on our server. This encryption is performed using a key generated by the user.

### Technologies

* Next.js
* Prisma
* MySQL 
* AES Encryption

### How to run

1. Clone the directory using git and enter the dir `cd H-H-Passwords`
2. Make sure you have nodejs installed so you run `npm install`
3. Set up your MySQL database and add connection data to `.env`
   
   ```bash
   DATABASE_URL="mysql://..."
   ```
4. Configure NextAuth with github provider in `next.config.js`
   
   ```js
   const nextConfig = {
        env: {
            GITHUB_APP_CLIENT_ID: '',
            GITHUB_APP_CLIENT_SECRET: '',
            NEXTAUTH_SECRET: '',
        },
    }
   ```
1. run the app using `npm run`

### Demo 

![demo](https://streamable.com/e3r5uv)
