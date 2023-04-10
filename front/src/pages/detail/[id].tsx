import React from "react";
import { useRouter } from "next/router";
import styles from "@styledPageStyle/Detail.module.css"
import { useAppDispatch, useAppSelector } from "src/store/hook";
import { setIsInPageDetail } from "src/store/slices/viewSlice";
import { getDetail$ } from "src/store/slices/apiCallSlice";
import Image from "next/image";
import { ChakraProvider, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Maps from "@components/Map";

export default function Detail() {
    const router = useRouter()
    const { id } = router.query
    const dispatch = useAppDispatch()
    const detailStore = useAppSelector(state => state.api.detail)
    const mapOptions: google.maps.MapOptions = {
      zoom: 15,
      streetViewControl: false,
      draggable: false,
      fullscreenControl: false,
      mapTypeControl: false,
      scrollwheel: false,
      zoomControl: true,
    };

    
    React.useEffect(() => {
      dispatch(setIsInPageDetail());
      if (id) {
        dispatch(getDetail$(id as string))
      }
    }, [dispatch, id])

    function displayDetail(): JSX.Element {
      if (detailStore && detailStore.place_id === id) {
        const lat = detailStore.location.split(",")[0].trim()
        const long = detailStore.location.split(",")[1].trim()
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
              <Maps style={{width:400, height:250, borderRadius: 10}} lat={lat} long={long} mapOptions={mapOptions} />
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
      <div className={styles.dWrapper}>
        { displayDetail() }
      </div>
    );
}