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

export const foo = "bar";

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

  // const client = await MongoClient.connect(mongoURI);
  return new MongoClient(mongoURI);
};

export const getUserCollection = (client: MongoClient) => {
  const mongoDB = process.env.DB_NAME;
  return client.db(mongoDB).collection("users");
};

export interface UserWithID extends WithId<Document> {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gradeRange: Array<number>;
  joinDate: Date;
  userType: string;
  academicInterest: Array<string>;
}

export const getMongoUser = async (userID: string) => {
  const client = await establishMongoConnection();
  const collection = getUserCollection(client);
  const userInfoCursor = collection.findOne({ _id: new ObjectId(userID) }, {});

  //TODO: There is probably a better way to translate the mongo response
  //TODO: A significant issue is that we are strictly reliant on all fields being present in the DB
  const userInfo = (await userInfoCursor) as UserWithID;
  //TODO: we probably don't want to return password here
  const userInfoSerializable = {
    ...userInfo,
    _id: userInfo._id.toString(),
    joinDate: userInfo.joinDate.toISOString(),
  };

  client.close();
  return userInfoSerializable;
};

export interface ProfileInformation {
  userID: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  gradeRange: Array<number>;
  academicInterest: Array<string>;
}

export const getProfileInformation = async (
  userID: string
): Promise<ProfileInformation> => {
  const rawUser = await getMongoUser(userID);
  return {
    userID: rawUser._id,
    email: rawUser.email,
    firstName: rawUser.firstName,
    lastName: rawUser.lastName,
    userType: rawUser.userType,
    gradeRange: rawUser.gradeRange,
    academicInterest: rawUser.academicInterest,
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
