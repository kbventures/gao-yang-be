import { Context } from "hono";

const getTodos = async (c: Context) => {


        const result = await c.env.DB.prepare("SELECT * from todos").all()
        if(!result || result.length == 0){
            return c.json({
                success:false,
                data: null,
                message: "No todos found",
            })
        }

        const todos = result?.results || [];

        return c.json({
            success: true,
            message:"Todos sent",
            data: todos,
            },
            { status: 200},

        )
}

export default getTodos;