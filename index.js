import express from "express";
import { join, resolve } from "path";
import slugify from "slugify";

import { TwingEnvironment, TwingLoaderFilesystem } from "twing";
import TwingDrupalFilters from "twing-drupal-filters";

// Configure template path.
const loader = new TwingLoaderFilesystem("./views");
// Configure custom namespace.
loader.addPath("./views/templates", "tch");
loader.addPath("./node_modules/tcds/dist", "tcds");

// Set up Twing environment.
const twing = new TwingEnvironment(loader);
// Add Drupal-like Twig filter support.
TwingDrupalFilters(twing);

// Set up app.
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.use(express.static(join(resolve(), "public")));

app.get("/", (req, res) => {
  twing.render("pages/index.twig", {
    /* Metadata can go here */
  }).then((output) => {
    res.end(output);
  }).catch((error) => {
    handle404(res);
    console.log(error);
  });
});

app.use((req, res) => {
  handle404(res);
});

function handle404(res) {
  res.status(404);

  twing.render("pages/404.twig", {
    title: "Page Not Found",
  }).then((output) => {
    res.end(output);
  });
}

app.listen(port, () => {
  console.log(`Server listening on http://${host}:${port}`);
});