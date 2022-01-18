module.exports = {
  google: {
    client_id:"your-client-id",
    client_secret:"your-client-secret",
    project_id:"your-project-id",
    "auth_uri":"https://accounts.google.com/o/oauth2/auth",
    token_uri:"https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs",
    redirect_uris:["http://localhost:9092/auth/google-login"],
    javascript_origins:["http://localhost:9092"]
  },
}
