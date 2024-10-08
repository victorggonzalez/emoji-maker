Using Express.js with Vercel
Express.js is a popular server framework used with Node.js. In this guide, we will cover how to deploy an Express.js application to Vercel along with some additional topics you’ll need to consider when adapting to a serverless environment.

Deploying on Vercel
Deploying an Express.js application on Vercel should require minimal or no code changes. Let’s use the steps below to create a new Express.js project and deploy it to Vercel.

Using a Template
We have an example of an Express project that can be cloned and deployed to Vercel as your initial starting point.

Using an existing project
Before you get started, you will need to have Node.js installed and a Vercel account to complete all the steps.

1. Create a new project
In your terminal, create a new directory and initialize your project:


mkdir new-express-project 
cd new-express-project 
npm init -y
These commands create a new project directory and a package.json file with default settings.

2. Install Express.js
Add Express to your project:


npm install express
3. Set up your Express.js app
Create a directory named /api.
Inside /api, create a file named index.ts. This will be your main server file.
4. Initialize an Express.js server
Edit your index.ts with the following code to set up a basic Express.js server:


const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
This code will:

Define the base route /
Return Express on Vercel when it’s called
And start the Express.js server running on port 3000
5. Configure your project for Vercel
By using a vercel.json file, you can control how Vercel configures your application.

For our application, we’re going to tell Vercel to route all incoming requests to our /api folder.

To configure this, create a vercel.json file in the root of your project and add the following code:


{ "version": 2, "rewrites": [{ "source": "/(.*)", "destination": "/api" }] }
6. Run your application locally
You can replicate the Vercel deployed environment locally by using the Vercel CLI. This allows you to test how your application will run as if it were running on Vercel, even before you deploy.

To get started, you need to install the Vercel CLI by running the following command in your terminal.


npm i -g vercel
Next, login to Vercel to authorize the Vercel CLI to run commands on your Vercel account.


vercel login
Now you use the local development command, which will also execute the vercel.json configuration you created above.


vercel dev
Running vercel dev will ask you some questions. You can answer however you like, but the defaults will suffice. This process will also create a new Vercel Project, but don’t worry, this will not make your Express.js app publicly accessible yet. We’ll get to that later.

When you’re done answering questions, you should now have a locally running server on http://localhost:3000 where you can test how your application works before you deploy to Vercel.

7. Deploy on Vercel
There are several ways you can deploy a project on Vercel, some of which include:

Vercel CLI
Creating a new project in the Vercel dashboard
Connecting your Git repo to Vercel
Since we’ve been working with the Vercel CLI, we’ll continue to use it to deploy your project on Vercel.

When you’re ready to make your Express.js application live and publicly accessible, you can run the vercel command to create a deployment.


vercel
This will upload your application to Vercel, build it, and deploy it. When the command is finished, it will give you a URL to your application. This will create your first deployment for your project.

From this point forward, running vercel again will create a Vercel Preview Deployment. This will give you a different URL to your application where you can test you changes live on Vercel and share this link with others to test.

When you are ready to make the latest changes live on your production URL, you can run vercel —dev or vercel promote [url].
