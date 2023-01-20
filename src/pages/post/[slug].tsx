import { GetStaticPaths, GetStaticPathsContext, GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import prismicDom from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}
// eslint-disable-next-line react/display-name
export default function Post({ post }: any) {
  const [time, setTime] = useState(0);
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  useEffect(() => {
    if (post) {
      let bodyLength = 0,
        headLength = 0;

      post.data.content.map(item => {
        bodyLength += prismicDom.RichText.asText(item.body).split(' ').length;
        headLength += item.heading.split(' ').length;
      });
      //console.log(bodyLength + headLength);
      setTime((bodyLength + headLength) / 200);
    }
  }, []);

  return (
    <>
      <div className={styles.banner}>
        <img src={`${post.data.banner.url}`} alt="Banner" />
      </div>
      <article className={styles.container}>
        <header>
          <h1>{post.data.title}</h1>
          <p className={styles.info}>
            <span>
              <FiCalendar />{' '}
              {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                locale: ptBR,
              })}
            </span>
            <span>
              <FiUser /> {post.data.author}
            </span>
            <span>
              <FiClock /> {Math.ceil(time)} min
            </span>
          </p>
        </header>
        <main>
          {post.data.content.map((item, index) => {
            return (
              <div className={styles.contentPost} key={index}>
                <h2>{item.heading}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: prismicDom.RichText.asHtml(item.body),
                  }}
                ></div>
              </div>
            );
          })}
        </main>
      </article>
    </>
  );
}

export const getStaticPaths = async (context: GetStaticPathsContext) => {
  const prismic = getPrismicClient({});

  const posts = await prismic.getByType('posts');

  const paths = posts.results.map(post => ({
    params: {
      slug: post.uid,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }: any) => {
  const prismic = getPrismicClient({});
  const { slug } = params;
  const response = await prismic.getByUID('posts', String(slug));

  const postReponse: PostProps = {
    post: {
      uid: response.uid,
      first_publication_date: response.first_publication_date,
      data: {
        title: response.data.title,
        subtitle: response.data.subtitle,
        author: response.data.author,
        banner: {
          url: response.data.banner.url,
        },
        content: response.data.content,
      },
    },
  };

  return {
    props: { post: postReponse.post },
  };
};
