import express from 'express';
import lists from '../lists'
import oppgaver from '../task';


const router = express.Router();

//root endpoint is /api/v1/lists/
router.get('/:listid', (req,res) =>{
    const id = req.params.listid;

    const list = lists.find(t =>t.id == id);
    if(list)
    {
        res.json(list)
    }else
    {
        res.status(404).send(`List with id ${id} is not found`);
    }
})

//Lag en ny liste
//response: displays the whole list including the new one

router.post('/', (req,res) =>{
    const list = req.body;
    //if the list doesnt contain the properties
    if(!list.hasOwnProperty('id') ||
        !list.hasOwnProperty('title'))
        {
            res.status(400).send('A list has to have an id and title properties');
        }
        //if the list already exits
    if(lists.find(t=>t.id == list.id))
    {
        res.status(400).send(`A list with an id ${list.id} is already available`);
    }
    else
    {
        lists.push(list);
        res.status(201);
        res.location('task/' + list.id);
        res.json(lists);
        res.send();
    }
})

//Slett en gitt liste og dens oppgaver
//response: displays the remaining list and tasks
router.delete('/:listid', (req, res) =>{
    const id = req.params.listid;

    const containerArray =[];//holds the remaining list/tasks after deleting
    
    const index = lists.findIndex(i =>i.id == id);
    if(index != -1)
    {
        lists.splice(index,1);
        containerArray.push(lists); // adding the remaining list

        //iteration through oppgaver med list id
        //because a list has more than one oppgave
        for(let i= 0; i<oppgaver.length; i++)
        {
            //the oppgave list-id with requested id
            const indexOppave = oppgaver.findIndex(i=>i.listId == id);
            if(indexOppave != -1)
                {
                    oppgaver.splice(indexOppave, 1);
                }
                else
                {
                    res.status(400).send(`A list id ${id} har ingen tilknyttet oppgaver`);
                }        
        }
        containerArray.push(oppgaver); //adding the remaining tasks

        res.json(containerArray);
    }

    else
    {
        res.status(404).send(`task with ${id} is not found`);
    }

})

//Hent alle oppgaver for en gitt liste
//response: displays all tasks in a given list

router.get('/:listId/tasks', (req,res) =>{
    const id = req.params.listId;

    var oppgave = oppgaver.filter(oppgave =>oppgave.listId == id);
    
    if(oppgave)
        {
            res.json(oppgave)
        }else
        {
            res.status(404).send(`List with id ${id} is not found`);
        }
    
})

//Hent en bestemt oppgave for en gitt liste

router.get('/:listId/tasks/:taskId', (req,res) =>{
    //variables for taskId and listId
    const listId = req.params.listId;
    const taskId = req.params.taskId;

    const containerArray =[]; // container for a list and/or a task

    const oppgave = oppgaver.find(t =>(t.taskID == taskId) && (t.listId == listId));
    if(oppgave)
    {
        res.json(oppgave)
    }else
    {
        res.status(404).send(`List with id ${listId} is not found`);
    }

})

//Lag en ny oppgave for en gitt liste

router.post('/:listId/tasks', (req,res) =>{
    const task = req.body;
    //if the list doesnt contain the properties
    if(!task.hasOwnProperty('taskID') ||
        !task.hasOwnProperty('title')||
        !task.hasOwnProperty('done') ||
        !task.hasOwnProperty('listId'))
        {
            res.status(400).send('A list has to have an taskID, title, done and listId properties');
        }
    
        //if the task has same taskID
    if(oppgaver.find(t=>t.taskID == task.taskID))
    {
        res.status(400).send(`A list with an id ${list.id} is already available`);
    }
    else
    {
        oppgaver.push(task);
        res.status(201);
        res.location('task/' + task.taskID);
        res.json(oppgaver.filter(t=>t.listId == task.listId)); // here we can see all tasks(including the new added) with the given listId
    }
})

//Slett en gitt oppgave i en bestemt liste

router.delete('/:listId/tasks/:taskId',(req,res) =>{
     //variables for taskId and listId
     const listId = req.params.listId;
     const taskId = req.params.taskId;
 
     const oppgaveIndex = oppgaver.findIndex(t =>(t.taskID == taskId) && (t.listId == listId));
     if(oppgaveIndex != -1)
        {
            oppgaver.splice(oppgaveIndex,1);
            res.json(oppgaver.filter(oppgave => oppgave.listId == listId))//the remaining tasks in the list (with the same listID)
        }
        {
            res.status(404).send(`List with id ${listId} and/or task with ${taskId} is not found`);
        }
})
export default router;