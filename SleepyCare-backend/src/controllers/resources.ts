import { isValidObjectId } from "mongoose";
import { Resource, IResource } from "../models/resources";

import { Response, Request, NextFunction } from "express"
import { title } from "process";
import { resourceValidationSchema } from "../validations/resource";

//
export const getResourceById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        let { id } = req.params;
        if (!isValidObjectId(id))
            return res.status(400).json({
                title: "object id is not valid",
                message: "the resource is not in correct ObjectId format"
            });
        let data = await Resource.findById(id);
        if (!data) {
            return res.status(404).json({
                title: "can`t get by id",
                message: "no product with such id" + id
            })
        }
        else return res.status(200).json({ data })


    }
    catch (e) { }
    return res.status(200).json({})
}



export const getAllResource = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const resources = await Resource.find()
        return res.status(200).json({ resources })
    }
    catch (err: unknown) {
        return res.status(400).json({
            title: "can`t get all",
            messege: err instanceof Error ? err.message : err
        })
    }

}

export const updateResourceById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {

    try {
        let { id } = req.params;
        let { body } = req;


        if (!isValidObjectId(id))
            return res.status(400).json({
                title: "object id is not valid",
                message: "not in correct ObjectId format",
            });

        const source = await Resource.findById(id)
        if (!source)
            return res.status(404).json({ title: "not found", message: `Resource not found with the given ID: ${id}` });
        const sourceData = source.toObject();
        //@ts-ignore
        delete sourceData.$__;
        //@ts-ignore
        delete sourceData.$isNew;
        //@ts-ignore
        delete sourceData._doc;
        //@ts-ignore
        delete sourceData._id;
        //@ts-ignore
        delete sourceData.__v;

        const newData = { ...sourceData, ...body }; // מיזוג בין ה-source וה-body שהתקבלו


        const { error } = resourceValidationSchema.validate(newData, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                title: "Validation error",
                message: "There were validation errors",
                // errors: error.details.map(detail => detail.message)
            })
        }

        const updateResource = await Resource.findByIdAndUpdate(id, newData, {
            new: true,
        })

        if (!updateResource) {
            return res.status(404).json({
                title: "Resource not found",
                message: `No resource found with the given ID: ${id}`,
            })
        }
        return res.status(200).json({
            title: "Resource Updated",
            resource: updateResource, // זה החלק המשמעותי
            oldResource: source, // מידע ישן למי שצריך
        });
    }
    catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        return res.status(500).json({
            title: "Update Failed",
            message,
        });
    }

}

export const addResource = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {

    const { body } = req;

    const validate = resourceValidationSchema.validate(body);
    if (validate.error) {
        return res.status(400).json(validate.error.details[0].message)
    }

    let newResource = new Resource(body);
    try {
        await newResource.save();
        return res.status(201).json(newResource)
    }
    catch (e) {
        return res.status(400).json({ title: "adding new product faild", message: e instanceof Error ? e.message : e });
    }
}


export const deleteResource = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        // בדיקה אם ה-ID בפורמט תקין של ObjectId
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                title: "Invalid ObjectId",
                message: "The provided ID is not a valid MongoDB ObjectId.",
            });
        }

        // מחיקת המשאב על פי ה-ID
        const resource = await Resource.findByIdAndDelete(id);

        if (!resource) {
            return res.status(404).json({
                title: "Resource Not Found",
                message: "No resource found with the given ID.",
            });
        }

        return res.status(200).json({
            title: "Resource Deleted",
            message: "The resource was successfully deleted.",
            deletedResource: resource,
        });
    } catch (error) {
        return res.status(500).json({
            title: "Deletion Failed",
            message: error instanceof Error ? error.message : "An unknown error occurred.",
        });
    }
};
