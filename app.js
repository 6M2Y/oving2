import  express  from 'express';
import lists from './lists'
import oppgaver from './task';

//router
import listrouter from './routes/listRouter'


// import express from "express";
// import lists from "./lists.js";
// import oppgaver from "./oppgaver.js";


const app = express();
app.use(express.json());

const port = 9000;
app.listen(port, () =>{
    console.info(`server is running on port: ${port}`);
})

app.use('/api/v1/lists/', listrouter);
app.use('/api/v1/lists/:listid', listrouter);
app.use('/api/v1/lists/:listId/tasks', listrouter);
app.use('/api/v1/lists/:listId/tasks/:taskId', listrouter);
app.use('/api/v1/lists/:listId/tasks', listrouter);
app.use('/api/v1/lists/:listId/tasks/:taskId', listrouter);