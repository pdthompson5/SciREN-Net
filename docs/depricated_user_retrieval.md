## Deprecated User Retrieval (SSR)
This code is a rough example of how we retrieve users (or other data) from the database.
It comes from profile.tsx; preserved here for reference.
```
interface Props {
  userID: string;
  firstName: string;
  lastName: string;
  email: string,
  userType: string
}


export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  // This is outdated, but since we may use i
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

  // Establish Mongo
  // const client = await MongoClient.connect(mongoURI);
  const client = new MongoClient(mongoURI);

  const collection = client.db(mongoDB).collection("users");
  console.log("Connected to MongoDB.");

  // Close mongoDB
  client.close();

   
  const userProps = {
    userID: "PLACEHOLDER_ID",
    firstName: "John",
    lastName: "Smith",
    email: "jsmith@sciren.net",
    userType: "Researcher"
  }

  return { props: userProps };
};

const Profile: React.FC<Props> = (props) => {
    ...
}
```