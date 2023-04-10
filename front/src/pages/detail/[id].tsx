import React from "react";
import { useRouter } from "next/router";
import styles from "@styledPageStyle/Detail.module.css"
import { useAppDispatch, useAppSelector } from "src/store/hook";
import { setIsInPageDetail } from "src/store/slices/viewSlice";
import { getDetail$ } from "src/store/slices/apiCallSlice";
import Image from "next/image";
import { ChakraProvider, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export default function Detail() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const detailStore = useAppSelector(state => state.api.detail)
    const { id } = router.query
    
    React.useEffect(() => {
      dispatch(setIsInPageDetail());
      if (id) {
        dispatch(getDetail$(id as string)).unwrap().then(response => {
          console.log(!response);
        });
      }
    }, [dispatch, id])

    function displayDetail(): JSX.Element {
      if (detailStore && detailStore.place_id === id) {
        return (
          <>
          <div className={styles.dWrapperLeft}>
            <Image className={styles.dWrapperLeftImage} src={detailStore.photo} alt="" width={500} height={500} priority/>
            <div className={styles.dTextDetail}>
              <div className={styles.dTextTitleContainer}>
                <h1 className={styles.dTitle}>{detailStore.name}</h1>
                <p className={styles.dSubTitle}>{detailStore.name}</p>
              </div>
              <div className={styles.dTextLinkContainer}>
                {
                  detailStore.website !== "Indisponible" && (
                  <ChakraProvider>
                    <Link display={'flex'} alignItems={'center'} className={styles.dOfficialSite} href={detailStore.website} isExternal>
                      Site officiel <ExternalLinkIcon mx='2px' />
                    </Link>
                  </ChakraProvider>
                  )
                }
                <p className={styles.dAddress}>{detailStore.formatted_address}</p>
              </div>
              <p className={styles.dTextDescription}>{detailStore.description}</p>
            </div>
          </div>
          <div className={styles.dWrapperRight}>
            <div className={styles.dWrapperRightItem}>
              <h3 className={styles.dWrapperRightItemTitle}>Localisation</h3>
              <p>{detailStore.location}</p>
            </div>
            <div className={styles.dWrapperRightItem}>
              <h3 className={styles.dWrapperRightItemTitle}>Horaire</h3>
              <div className={styles.dWrapperRightItemInfo}>
                {
                  detailStore.hours.map(item => (
                    <p key={item.id}>{item.value.replace(item.value.charAt(0), item.value.charAt(0).toUpperCase())}</p>
                  ))
                }
              </div>
            </div>
            <div className={styles.dWrapperRightItem}>
              <h3 className={styles.dWrapperRightItemTitle}>Contact</h3>
              <div className={styles.dWrapperRightItemInfo}>
                <p>Téléphone : <span>{detailStore.phone}</span></p>
              </div>
            </div>
          </div>
          </>
        )
      }
      // Aucun détail
      return (<></>)
    }

    return (
      <div className={styles.dContainer}>
      <div className={styles.dWrapper}>
        { displayDetail() }
      </div>
      </div>
    );
}