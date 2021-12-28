import Head from 'next/head';
import { MongoClient, ObjectId } from 'mongodb';
import { Fragment } from 'react';

import MeetUpDetail from "../../components/meetups/MeetUpDetail";

function MeetUpDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetUpData.title}</title>
        <meta
          name="description"
          content={props.meetUpData.description}
        />
      </Head>
      <MeetUpDetail
        image={props.meetUpData.image}
        title={props.meetUpData.title}
        address={props.meetUpData.address}
        description={props.meetUpData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {

  const client = await MongoClient.connect('mongodb+srv://yekokooo:30101991@cluster0.sgxz3.mongodb.net/meetups?retryWrites=true&w=majority');
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    }))
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect('mongodb+srv://yekokooo:30101991@cluster0.sgxz3.mongodb.net/meetups?retryWrites=true&w=majority');
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetupList = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });

  client.close();

  return {
    props: {
      meetUpData: {
        id: meetupList._id.toString(),
        title: meetupList.title,
        image: meetupList.image,
        address: meetupList.address,
        description: meetupList.description,
      }
    }
  };
}

export default MeetUpDetails;
