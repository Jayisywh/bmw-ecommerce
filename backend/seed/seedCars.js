import dotenv from "dotenv";
import mongoose from "mongoose";
import dbConnect from "../config/db.js";
import Category from "../models/category.js";
import Car from "../models/car.js";

dotenv.config();

const carsData = [
  {
    name: "BMW Series 1",
    series: "1 Series",
    price: 32000,
    engineType: "2.0L I4",
    horsePower: "180",
  },
  {
    name: "BMW Series 2",
    series: "2 Series",
    price: 38000,
    engineType: "2.0L I4 Turbo",
    horsePower: "220",
  },
  {
    name: "BMW Series 3",
    series: "3 Series",
    price: 42000,
    engineType: "2.0L I4 Turbo",
    horsePower: "255",
  },
  {
    name: "BMW Series 4",
    series: "4 Series",
    price: 47000,
    engineType: "3.0L I6",
    horsePower: "320",
  },
  {
    name: "BMW Series 5",
    series: "5 Series",
    price: 56000,
    engineType: "2.0L I4 / 3.0L I6",
    horsePower: "300",
  },
  {
    name: "BMW Series 6",
    series: "6 Series",
    price: 68000,
    engineType: "3.0L I6",
    horsePower: "340",
  },
  {
    name: "BMW Series 7",
    series: "7 Series",
    price: 95000,
    engineType: "3.0L I6 / V8",
    horsePower: "390",
  },
  {
    name: "BMW X1",
    series: "X1",
    price: 36000,
    engineType: "1.5L I3",
    horsePower: "140",
  },
  {
    name: "BMW X3",
    series: "X3",
    price: 50000,
    engineType: "2.0L I4",
    horsePower: "260",
  },
  {
    name: "BMW Z4",
    series: "Z4",
    price: 58000,
    engineType: "2.0L I4 Turbo",
    horsePower: "255",
  },
];

const colors = ["black", "white", "blue"];

function buildImages(name) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const images = {};
  for (const color of colors) {
    images[color] = [
      `/images/cars/${slug}-${color}-front.jpg`,
      `/images/cars/${slug}-${color}-engine.jpg`,
      `/images/cars/${slug}-${color}-interior.jpg`,
      `/images/cars/${slug}-${color}-back.jpg`,
    ];
  }
  return images;
}

async function seed() {
  await dbConnect();

  try {
    // Ensure there's at least one category to reference
    let category = await Category.findOne({ name: "Sedan" });
    if (!category) {
      category = await Category.create({
        name: "Sedan",
        description: "Default sedan category for seeded cars",
      });
    }

    for (const c of carsData) {
      const carDoc = {
        name: c.name,
        series: c.series,
        price: c.price,
        categoryId: category._id,
        engineType: c.engineType,
        horsePower: c.horsePower,
        colors,
        images: buildImages(c.name),
        defaultColor: "black",
        isFeatured: false,
      };

      // Upsert by name to avoid duplicates when running multiple times
      await Car.findOneAndUpdate({ name: c.name }, carDoc, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
      console.log(`Seeded/Updated car: ${c.name}`);
    }

    console.log("Seeding complete.");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
