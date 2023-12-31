"use client";

import Link from "next/link";
import styles from "./comment.module.css";
import Image from "next/image";
import useSWR from "swr" ; 
import { useSession } from "next-auth/react";
import { useState } from "react";

const fetcher = async(url)=>{
  const res = await fetch(url)
  const data = await res.json();
  if(!res.ok){
    const error = new Error(data.message);
    throw error;
  }
  return data;
}

const Comment = ({postSlug}) => {
    const {status} = useSession();

    const {data,mutate , isLoading} = useSWR(`${process.env.NEXTAUTH_URL}/api/comments?postSlug=${postSlug}`, fetcher )

    const[desc , setdesc] = useState("")

    const handlesubmit=async()=>{

      await fetch("/api/comments" , {
        method:"POST" , 
        body:JSON.stringify({desc , postSlug})
      })
      mutate()

    }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Comments</h1>
      {status === status ? (
        <div className={styles.write}>
          <textarea
            placeholder="write a comment..."
            className={styles.input}
            onChange={e=>setdesc(e.target.value)}


            
          />
          <button className={styles.button} onClick={handlesubmit}>
            Send
          </button>
        </div>
      ) : (
        <Link href="/login">Login to write a comment</Link>
      )}
      <div className={styles.comments}>
        
             { isLoading?"Loading" :data?.map(item=>(

              <div key={item._id} className={styles.comment} >
                <div className={styles.user}>
                 
                  {item?.user?.image &&  <Image
                      src={item.user.image}
                      alt=""
                      width={50}
                      height={50}
                      className={styles.image}
                    />}
             
                  <div className={styles.userInfo}>
                    <span className={styles.username}>{item.user.name}</span>
                    <span className={styles.date}>{item.createdAt.substring(0,10)}</span>
                  </div>
                </div>
                <p className={styles.desc}>{item.desc}</p>
              </div>
           
      
      ))
      
      }
      </div>
    </div>
  );
};

export default Comment;
