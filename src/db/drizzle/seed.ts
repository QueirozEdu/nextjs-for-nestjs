// import { JsonPostRepository } from "./../../repositories/post/json-post-repository";
// import { drizzleDb } from ".";
// import { postsTable } from "./schemas";

// (async () => {
//     const jsonPostRepository = new JsonPostRepository();
//     const posts = await jsonPostRepository.findAll();

//     try {
//         await drizzleDb.delete(postsTable); //Careful with this line. This is literally Delete everywhere
//         await drizzleDb.insert(postsTable).values(posts);
//         console.log(`Done! ${posts.length} posts where saved in the database`);
//     } catch (e) {
//         console.log("");
//         console.log("An error occurred: ");
//         console.log("");
//         console.log("");
//         console.log(e);
//         console.log("");
//     }
// })();
