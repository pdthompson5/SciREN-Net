import { MongoClient, WithId } from "mongodb";

export const establishMongoConnection = async () => {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
      );
    }
  
    const mongoDB = process.env.DB_NAME;
    if (!mongoDB) {
      throw new Error(
        "Please define the MONGODB_DB environment variable inside .env.local"
      );
    }

    // const client = await MongoClient.connect(mongoURI);
    return new MongoClient(mongoURI);
}

export const getUserCollection = (client: MongoClient) => {
    const mongoDB = process.env.DB_NAME;
    return client.db(mongoDB).collection("users");
}

interface UserWithID extends WithId<Document> {
    userid: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    grades_taught: string;
    joindate: Date;
    usertype: string;
    academicinterest: Array<string>;
}

export const getUser = async (userID: string)=> {
    const client = await establishMongoConnection();
    const collection = getUserCollection(client);
    const userInfoCursor = collection.findOne({userid: userID}, {});

    //TODO: There is probably a better way to translate the mongo response
    //TODO: A significant issue is that we are strictly reliant on all fields being present in the DB
    const userInfo = (await userInfoCursor) as UserWithID
    //TODO: we probably don't want to return password here
    const userInfoSerializable = {
        ...userInfo,
        _id: userInfo._id.toString(),
        joindate: userInfo.joindate.toISOString()
    }

    client.close();
    return userInfoSerializable;
}

export interface ProfileInformation {
    userID: string,
    email: string,
    firstName: string,
    lastName: string,
    userType: string,
    gradesTaught: string,
    academicInterests: Array<string>
}

export const getProfileInformation = async (userID: string): Promise<ProfileInformation> => {
    const rawUser = await getUser(userID)
    return {
        userID: rawUser.userid,
        email: rawUser.email,
        firstName: rawUser.firstname,
        lastName: rawUser.lastname,
        userType: rawUser.usertype,
        gradesTaught: rawUser.grades_taught,
        academicInterests: rawUser.academicinterest
    }
}

export const getAllUserIDs = async () => {
    const client = await establishMongoConnection();
    const collection = getUserCollection(client);

    const userIDs = collection.distinct("userid");

    client.close();
    return userIDs;
}
  
