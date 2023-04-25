import { User } from "@/pages/api/userSession";
import { MongoClient, ObjectId, WithId } from "mongodb";

export interface LessonLink {
  text: string;
  href: string;
}

export interface Author {
  name: string;
  contact: string;
  position: string;
}

export interface Lesson {
  _id: string;
  title: string;
  year: number;
  abstract: string;
  subject: string;
  mediaLinks: LessonLink[];
  contentLinks: LessonLink[];
  authors: Author[];
  gradeLevel: number[];
}

export const USER_COLLECTION_NAME = "usersv2";

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
      "Please define the DB_NAME environment variable inside .env.local"
    );
  }

  return new MongoClient(mongoURI);
};

export const getUserCollection = (client: MongoClient) => {
  const mongoDB = process.env.DB_NAME;
  return client.db(mongoDB).collection<Omit<User, "userID">>(USER_COLLECTION_NAME);
};

export interface UserWithID extends WithId<Document> {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gradeRange: Array<number>;
  joinDate: string;
  userType: string;
  academicInterest: Array<string>;
  organizations: Array<string>;
  position: string;
  textBio: string;
  scirenRegion: string;
}

export const getMongoUser = async (userID: string) => {
  const client = await establishMongoConnection();
  const collection = getUserCollection(client);
  const userInfoCursor = collection.findOne({ _id: new ObjectId(userID) }, {});

  const userInfo = await userInfoCursor;
  if(userInfo === null) {
    client.close();
    throw new Error(`User not found with id ${userID}`)
  }

  const userInfoSerializable = {
    ...userInfo,
    _id: userInfo._id.toString()
  };

  client.close();
  return userInfoSerializable;
};

export type Profile = Omit<User, "password" | "joinDate"> 

export const getProfile = async (
  userID: string
): Promise<Profile> => {
  const rawUser = await getMongoUser(userID);
  return {
    userID: rawUser._id,
    ...rawUser
  };
};

export const getAllUserIDs = async () => {
  const client = await establishMongoConnection();
  const collection = getUserCollection(client);

  const userIDs = collection.distinct("_id");
  const userIDsStrings = (await userIDs).map((id) => id.toString());

  client.close();
  return userIDsStrings;
};

const mapLinks = (links: any) => {
  return links.map((link: any) => ({
    text: link.text,
    href: link.href,
  }));
};

export const getLessonPlans = async (
  sortKey?: string, // Fields to sort by, TODO: make this an enum
  sortDirection?: number // 1 for ascending, -1 for descending
) => {
  // Get Lesson Plans for listing page
  const client = await establishMongoConnection();
  const collection = client.db("sciren").collection("lessons");
  const lessonPlans = await collection.find({}).toArray();
  client.close();
  const TypedLessonPlans: Lesson[] = lessonPlans.map(
    (lesson): Lesson => ({
      _id: lesson._id.toString(),
      title: lesson.title,
      year: lesson.year,
      abstract: lesson.abstract,
      mediaLinks: lesson.mediaLinks as LessonLink[],
      contentLinks: mapLinks(lesson.contentLinks),
      authors: lesson.authors as Author[],
      gradeLevel: lesson.gradeLevel as number[],
      subject: lesson.subject,
    })
  );
  return TypedLessonPlans;
};

const getLimitedProfile = (profile: WithId<Omit<User, "userID">>) => {
  const {_id, password, joinDate, ...limitedProfile} = profile;
  return {
    userID: profile._id.toString(),
    ...limitedProfile
  }
}

export const getProfiles = async (
  sortKey?: string, // Fields to sort by, TODO: make this an enum
  sortDirection?: number // 1 for ascending, -1 for descending
) => {
  const client = await establishMongoConnection();
  const collection = getUserCollection(client)
  const profiles = await collection.find({}).toArray();
  client.close();
  const typedProfiles: Profile[] = profiles.map(
    (profile) => (getLimitedProfile(profile))
  );
  return typedProfiles;
}
