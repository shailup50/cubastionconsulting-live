module.exports = {
  apps: [
    {
      name: "cubastionconsulting",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/home/cubastionconsult/public_html",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
