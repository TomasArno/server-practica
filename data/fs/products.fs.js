import fs from "node:fs/promises";
import { existsSync, writeFileSync } from "node:fs";
import crypto from "node:crypto";

class ProductManager {
  static #path = "./data/fs/files/products.json";

  constructor() {
    this.init();
  }

  init() {
    if (!existsSync(ProductManager.#path)) {
      const data = JSON.stringify([], null, 2);

      writeFileSync(ProductManager.#path, data);
    }
  }

  async create(data) {
    const propsList = ["title", "photo", "price", "stock"];
    const keyList = Object.keys(data);

    const missingProps = [];

    for (let i = 0; i < propsList.length; i++) {
      !keyList.includes(propsList[i]) ? missingProps.push(propsList[i]) : null;
    }

    if (missingProps.length) {
      console.log(`Propiedades faltantes: ${missingProps.join(" ")}`);
    } else {
      const { title, photo, price, stock } = data;

      const products = await this.readFile();

      products.push({
        id: crypto.randomBytes(12).toString("hex"),
        title,
        photo,
        price,
        stock,
      });

      try {
        await fs.writeFile(
          ProductManager.#path,
          JSON.stringify(products, null, 2)
        );

        return products[products.length - 1];
      } catch (e) {
        throw e.error;
      }
    }
  }

  async readFile() {
    try {
      const products = JSON.parse(
        await fs.readFile(ProductManager.#path, {
          encoding: "utf-8",
        })
      );

      return products;
    } catch (e) {
      throw e.message;
    }
  }

  async readOne(id) {
    try {
      const products = await this.readFile();

      return products.find((el) => el.id == id) ?? [];
    } catch (e) {
      throw e.message;
    }
  }

  async destroy(id) {
    try {
      const products = await this.readFile();
      const newList = products.filter((el) => el.id !== id);

      if (products.length == newList.length) return false;

      await fs.writeFile(
        ProductManager.#path,
        JSON.stringify(newList, null, 2)
      );

      return true;
    } catch (error) {
      throw e.error;
    }
  }
}

const ProductsManager = new ProductManager();

export default ProductsManager;
