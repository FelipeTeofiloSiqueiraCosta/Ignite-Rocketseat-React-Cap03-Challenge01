import Head from 'next/head';

import { GetStaticProps } from 'next';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../services/prismic';
import { FiCalendar, FiUser } from 'react-icons/fi';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Post {
  uid?: string | null;
  first_publication_date: string | null;
  data: {
    title?: string | undefined;
    subtitle?: string | null;
    author?: string | null;
  };
}

interface PostPagination {
  next_page: string | null;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}
// eslint-disable-next-line react/display-name
export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<PostPagination>(postsPagination);
  useEffect(() => {
    setPosts(postsPagination);
  }, []);

  function loadMore(url: string | null) {
    fetch(url!)
      .then(res => res.json())
      .then(data => {
        setPosts({
          next_page: data.next_page,
          results: [...posts.results, ...data.results],
        });
      });
  }

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main className={styles.container}>
        {posts ? (
          posts.results.map(post => {
            return (
              <div key={post.uid} className={styles.post}>
                <Link href={`./post/${post.uid}`}>
                  <a>
                    <header>
                      <h1>{post.data.title}</h1>
                    </header>
                    <p>{post.data.subtitle}</p>
                    <footer>
                      <span>
                        <FiCalendar />{' '}
                        {format(
                          new Date(post.first_publication_date),
                          'dd MMM yyyy',
                          {
                            locale: ptBR,
                          }
                        )}
                      </span>
                      <span>
                        <FiUser /> {post.data.author}
                      </span>
                    </footer>
                  </a>
                </Link>
              </div>
            );
          })
        ) : (
          <p>Carregando...</p>
        )}
        <br />
        {posts.next_page !== null && (
          <button
            className={styles.loadMore}
            onClick={() => loadMore(posts.next_page)}
          >
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', { pageSize: 2 });

  const posts: PostPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results,
  };

  return {
    props: {
      postsPagination: posts,
    } as HomeProps,
    revalidate: 60 * 60 * 1,
  };
};
