import express from "express";
import ProductsManager from "./data/fs/products.fs.js";
import UsersManager from "./data/fs/users.fs.js";

const server = express();

const PORT = 8080;

const ready = () => console.log("server ready on port " + PORT);

server.listen(PORT, ready);

// MIDDLEWARES

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/api/users", async (req, res) => {
  try {
    const all = await UsersManager.readFile();

    if (all.length === 0) {
      //   throw new Error("Not found users");
      return res /*.status(404)*/
        .json({
          statusCode: 404,
          message: "Not found users",
        });
    }

    console.log(all);

    return res.json({
      statusCode: 200,
      response: all,
    });
  } catch (e) {
    console.log(e);

    return res.json({
      statusCode: 500,
      message: e.message,
    });
  }
});

server.get("/api/users/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const one = await UsersManager.readOne(uid);

    if (!one) {
      return res.json({
        statusCode: 404,
        message: "User not found",
      });
    }

    console.log(one);

    return res.json({
      statusCode: 200,
      response: one,
    });
  } catch (e) {
    console.log(e);

    return res.json({
      statusCode: 500,
      message: e.message,
    });
  }
});
  
server.get("/api/products", async (req, res) => {
    try {
        const all = await ProductsManager.readFile();

        if (all.lenght === 0) {
            return res.json({
                statusCode: 404,
                message: "Not found products",
            });
        }
        return res.json({
            statusCode: 200,
            response: all,
        });
    } catch (error) {
        console.log(error);
        return res.json({
            statusCode: 500,
            message: error.message,
        });
    }
});

server.get("/api/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const one = await ProductsManager.readOne(pid);

        if (!one) {
            return res.json({
                statusCode: 404,
                message: "Not found product",
            });
        } else {
            return res.json({
                statusCode: 200,
                response: one,
            });
        }
    } catch (error) {
        console.log(error);
        return res.json({
            statusCode: 500,
            message: error.message,
        });
    }
});
