const asyncHandler =require("express-async-handler");
const Contact=require("../models/contactModel");
const { constants } = require("../constants");
//@desc Get all contacts
//@route Get /api/contacts
//@access private

const getContacts = asyncHandler(async (req,res) => {
    const contacts=await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
});

//@desc Create New contact
//@route Post /api/contacts
//@access private

const createContact = asyncHandler( async (req,res) => {
    console.log("The requested Body is ",req.body)
    const {name,email,phone}= req.body;
    if(!name||!email||!phone){
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id:req.user.id,
    })
    res.status(200).json(contact);
});

//@desc Get contact
//@route Get /api/contacts/:id
//@access private

const getContact = asyncHandler(  async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not Found");
    }
    res.status(200).json(contact);
});

//@desc Update contact
//@route Put /api/contacts/:id
//@access private

const updateContact = asyncHandler(  async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not Found");
    }

    if(contact.user_id.toString()!== req.user.id){
        res.status(403);
        throw new Error("User don't have permission to update user contact");
    }

    const updatedContact= await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    res.status(200).json(updatedContact );
});

//@desc Delete contact
//@route delete /api/contacts/:id
//@access private

const deleteContact = asyncHandler(  async (req,res) => {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not Found");
    }
   
    res.status(200).json(contact); 
});



module.exports = {getContacts ,createContact,getContact ,updateContact,deleteContact}