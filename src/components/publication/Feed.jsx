import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { PublicationList } from '../publication/PublicationList';


export const Feed = () => {

  const { auth } = useAuth();
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const params = useParams();

  useEffect(() => {
    getPublications(1, true);
  }, []);

  const getPublications = async (nextPage = 1) => {
    const request = await fetch(Global.url + "publication/feed/" + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });

    const data = await request.json();

    if (data.status == "success") {

      let newPublications = data.publications;

      if (publications.length >= 1) {
        newPublications = [...publications, ...data.publications];
      }

      setPublications(newPublications);

      if (publications.length >= (data.total - data.publications.length)) {
        setMore(false);
      }
      if (data.pages <= 1){
        setMore(false);
      }
    }
  }

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Timeline</h1>
        <button className="content__button">Mostrar nuevas</button>
      </header>

      <PublicationList
        publications={publications}
        getPublications={getPublications}
        page={page}
        setPage={setPage}
        more={more}
        setMore={setMore}
      />
      <br />
    </>
  );
};
