

import  db from '../lib/dbknex'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const Allposts= async (req, res ,next) => {

   try { 
const posts = await db('posts4');

res.status(200);
res.json({
    message: 'Posts data',
    data: posts
});

   } catch (error) {

    res.status(500).json({
        message: 'Error',
        data: error.message
   });
}


}



export const CreatePost= async (req, res) => {

    const { title, content  } = req.body;
    console.log(req.body);

    try{
    const create = await db('post4').insert({
        title,
        content,
        
    });
    
    console.log('create',create)
    const createdData = await db('posts4').where('id', create).first();

    console.log('createdData',createdData)
    res.status(200);
    res.json({
        message: 'Post created successfully',
        data: createdData
    });
   
 
}   catch(err){

    console.log(err)
    res.status(500);
    res.json({
        message: 'Error creating post',
        data: err
    });
}

    
    }
    
    


     export const UpdatePost= async (req, res) => {

        const { id } = req.query;
        const { title, content } = req.body;
    
        // update post

        const update = await db('posts2')
                                .where({ id })
                                .update({
                                    title,
                                    content
                                });
    
        // fetch updated post after update
        const updatedData = await db('posts2').where({ id }).first();
    
        res.status(200);
        res.json({
            message: 'Post updated successfully',
            data: updatedData
        });


     }



        export const DeletePost= async (req, res) => {

            const { id } = req.query;

            const deleteRow = await db('posts2').where({ id }).del();
        
            res.status(200);
            res.json({
                message: 'Post deleted successfully'
            });

        }




        export const Login= async (req, res) => {

  try {

  


            const { email, password } = req.body;
            console.log('login data-->',req.body);

            const checkUser = await db('users2')
            .where({ email })
            .first();

           

                                    console.log('checkUser-------->',checkUser)
        
            if(!checkUser) return res.status(401).end();
        
            const checkPassword = await bcrypt.compare(password, checkUser.password);
        
            if(!checkPassword) return res.status(401).end();
        
            const token = jwt.sign({
                id: checkUser.id,
                email: checkUser.email
            }, process.env.JWT_SECRET, {
                expiresIn: '7d'
            });
            console.log('token-------->',token)
        
            res.status(200);
            res.json({
                message: 'Login successfully',
                token
            });
        } 

        catch(err){


            res.status(500)
            res.json({
                message: 'Error Login user',
                data: err.message
            });
        }



        }



        export const Register  = async (req,res) => {


            try {

            
            const { email, password } = req.body;
            console.log('register data ----->',req.body);
            const salt = bcrypt.genSaltSync(10);
            const passwordHash = bcrypt.hashSync(password, salt);
        

            const checkUser = await db('users2')
            .where({ email })
            .first();

           

                                    console.log('checkUser-------->',checkUser)
        
            if(checkUser) return res.status(402).json({
                message: 'User already exists',
                data: checkUser
             });



            const register = await db('users2').insert({
                email,
                password: passwordHash
            });
        
            const registeredUser = await db('users2')
                                            .where({ id: register })
                                            .first();
        
            res.status(200);
            res.json({
                message: 'User registered successfully',
                data: registeredUser
            });

        }   catch(err){


            res.status(500)
            res.json({
                message: 'Error registering user',
                data: err.message
            });
        }


        }




        export const CreateCategory= async (req, res) => {


            

                const { name, desc ,image } = req.body;
                console.log(req.body);
            
                const id = uuidv4(); 


                try{
                const create = await db('categories').insert({
                    name,
                    desc,
                   id,
                    image: image ? image : 'https://via.placeholder.com/150'
                    
                });
                
                console.log('create',create)
                const createdData = await db('categories').where('id', id).first();
            
                console.log('createdData',createdData)
                res.status(200);
                res.json({
                    message: 'category created successfully',
                    data: createdData
                });
               
             
            }   catch(err){
            
                console.log(err)
                res.status(500);
                res.json({
                    message: 'Error creating category',
                    data: err
                });
            
            }
        }

            
                
        export const  AllCategories = async (req, res ,next) => {

            try { 
         const categories = await db('categories');
         
         res.status(200);
         res.json({
             message: 'categories data',
             data: categories
         });
         
            } catch (error) {
         
             res.status(500).json({
                 message: 'Error',
                 data: error.message
            });
         }
         
         
         }
         
                


         export const CreateProduct= async (req, res) => {


            

            const { name, desc ,image,price,quantity,cat_id } = req.body;
            console.log(req.body);
        
            const id = uuidv4(); 


            try{
            const create = await db('porducts').insert({
                name,
                price,
                quantity,
                desc,
               id,
               cat_id,
                image: image ? image : 'https://via.placeholder.com/150'
                
            });
            
            console.log('create',create)
            const createdData = await db('porducts').where('id', id).first();
        



            console.log('createdData',createdData)
            res.status(200);
            res.json({
                message: 'Product created successfully',
                data: createdData
            });
           
         
        }   catch(err){
        
            console.log(err)
            res.status(500);
            res.json({
                message: 'Error creating category',
                data: err
            });
        
        }
    }


        

    export const  AllProducts = async (req, res ,next) => {

        try { 
     const products = await db('porducts');
     // find all products and  populate the category
        const productsWithCategory = await db('porducts').join('categories', 'categories.id', '=', 'porducts.cat_id');
     



     res.status(200);
     res.json({
         message: ' porducts data',
         data: productsWithCategory
     });
     
        } catch (error) {
     
         res.status(500).json({
             message: 'Error',
             data: error.message
        });
     }
     
     
     }
     