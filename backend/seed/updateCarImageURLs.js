import dotenv from "dotenv";
import mongoose from "mongoose";
import dbConnect from "../config/db.js";
import Car from "../models/car.js";

dotenv.config();

const cars = [
  "BMW Series 1",
  "BMW Series 2",
  "BMW Series 3",
  "BMW Series 4",
  "BMW Series 5",
  "BMW Series 6",
  "BMW Series 7",
  "BMW X1",
  "BMW X3",
  "BMW Z4",
];

const colors = ["black", "white", "blue"];
const views = ["front", "engine", "interior", "rear"];

function buildUnsplashUrl(query) {
  // Use the Unsplash Source service to return a matching photo for the query.
  // This produces a redirect to an actual image; the URL itself can be used as an image source.
  const encoded = encodeURIComponent(query);
  return `https://source.unsplash.com/1600x900/?${encoded}`;
}

function buildImagesForCar(name) {
  const images = {};
  for (const color of colors) {
    images[color] = views.map((v) => buildUnsplashUrl(`${name} ${color} ${v}`));
  }
  return images;
}

async function update() {
  await dbConnect();

  try {
    for (const name of cars) {
      const imgs = buildImagesForCar(name);
      const updated = await Car.findOneAndUpdate(
        { name },
        { $set: { images: imgs, colors } },
        { new: true },
      );
      if (updated) {
        console.log(`Updated images for: ${name}`);
      } else {
        console.log(`Car not found (skipping): ${name}`);
      }
    }
    console.log("All done.");
  } catch (err) {
    console.error("Error updating images:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

update();
