import React from "react";
import { useRouter } from "next/router";
import styles from "@styledPageStyle/Detail.module.css"
import { useAppDispatch, useAppSelector } from "src/store/hook";
import { setIsInPageDetail } from "src/store/slices/viewSlice";
import { getDetail$, getTransport$, setDetailId } from "src/store/slices/apiCallSlice";
import Image from "next/image";
import { Button, ChakraProvider, CloseButton, Link, Spinner } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Maps from "@components/Map";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';

export default function Detail() {
    const router = useRouter()
    const { id } = router.query
    const dispatch = useAppDispatch()
    const [located, setLocated] = React.useState<boolean>(false);
    const detailStore = useAppSelector(state => state.api.detail)
    const [displayItinerary, setDisplayItinerary] = React.useState<{
      type: 'ask' | 'fullfied' | 'rejected' | 'pending',
      response: boolean
    }>({
      type: 'ask',
      response: false,
    })
    const mapOptions: google.maps.MapOptions = {
      zoom: 15,
      streetViewControl: false,
      draggable: false,
      fullscreenControl: false,
      mapTypeControl: false,
      scrollwheel: false,
      zoomControl: true,
    };

    const [resultTransport, setResultTransport] = React.useState<{
      walk: string,
      drive: string,
      bicycl: string,
      transit: string
    }>()
    const [latDep, setLatDep] = React.useState<string | null>(null)
    const [lngDep, setLngDep] = React.useState<string | null>(null)
    
    React.useEffect(() => {
      dispatch(setIsInPageDetail());
      if (id) {
        dispatch(setDetailId(id as string))
        dispatch(getDetail$(id as string))
      }
    }, [dispatch, id])

    function handleDisplayItinerary() {
      const latDest = detailStore?.location.split(",")[0].trim()
      const lngDest = detailStore?.location.split(",")[1].trim()
      setDisplayItinerary({
        type: 'pending',
        response: false,
      })
      navigator.geolocation.getCurrentPosition((pos) => {
        setLatDep(pos.coords.latitude.toString())
        setLngDep(pos.coords.longitude.toString())
        setLocated(true);
        dispatch(getTransport$({
          locationDest: `${latDest},${lngDest}`,
          locationStart: `${latDep},${lngDep}`
        })).unwrap().then(response => {
          setResultTransport(response.results)
        })
        setDisplayItinerary({
          type: 'fullfied',
          response: true,
        });
      })
      if (!latDep && !lngDep) {
        setLocated(false);
        setDisplayItinerary({
          type: 'rejected',
          response: false,
        });
      }
    }

    function displayDetail(): JSX.Element {
      if (detailStore && detailStore.place_id === id) {
        const lat = detailStore.location !== 'Not available' ? detailStore.location.split(",")[0].trim() : 'Not available'
        const long = detailStore.location  !== 'Not available' ? detailStore.location.split(",")[1].trim() : 'Not available'
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
                  detailStore.website !== "Not available" && (
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
            <div className={styles.dWrapperRightTop}>
              <div className={styles.dWrapperRightItem}>
                <h3 className={styles.dWrapperRightItemTitle}>Localisation</h3>
                {
                  lat !== 'Not available' && long !== 'Not available' ? (
                    <Maps style={{height:250, borderRadius: 10}} position={{depart: {lat: lat, long: long, data: detailStore}}}  mapOptions={mapOptions} />
                  ) : (
                    <p>Position is not available</p>
                  )
                }
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
            <ChakraProvider>
              <Button
                variant='outline'
                colorScheme="blue"
                className={styles.dItineraryButton}
                isDisabled={detailStore.location === 'Not available'}
                onClick={(() => handleDisplayItinerary())}
              >
                Itinerary
              </Button>
            </ChakraProvider>
          </div>
          </>
        )
      }
      // Aucun détail
      return (<></>)
    }

    function displayOverlay(): JSX.Element {
      if (detailStore && detailStore.place_id === id) {
        const latDest = detailStore.location.split(",")[0].trim()
        const lngDest = detailStore.location.split(",")[1].trim()
        const mapOptionsItinerary: google.maps.MapOptions = {
          zoom: 6,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          zoomControl: true,
        };
        if (latDep && lngDep && located) {
          return (
            <div className={styles.dOverlay}>
              <div className={styles.dOverlayContent}>
                <div className={styles.dOverlayDirection}>
                  {
                    <>
                      <span>
                        <DirectionsWalkIcon /> 
                        {
                          !resultTransport ? (
                            <Spinner size='md' label="Veuillez patienter..." ></Spinner>
                          ) : (
                            resultTransport?.walk
                          )
                        }
                      </span>
                      <span>
                        <DirectionsBikeIcon /> 
                        {
                          !resultTransport ? (
                            <Spinner size='md' label="Veuillez patienter..." ></Spinner>
                          ) : (
                            resultTransport?.bicycl
                          )
                        }
                      </span>
                      <span>
                        <DirectionsCarIcon /> 
                        {
                          !resultTransport ? (
                            <Spinner size='md' label="Veuillez patienter..." ></Spinner>
                          ) : (
                            resultTransport?.drive
                          )
                        }
                      </span>
                      <span>
                        <DirectionsTransitIcon />
                        {
                          !resultTransport ? (
                            <Spinner size='md' label="Veuillez patienter..." ></Spinner>
                          ) : (
                            resultTransport?.transit
                          )
                        }
                      </span>
                      
                    </>
                  }
                </div>
                <Maps
                  style={{
                    borderRadius: window.innerWidth > 800 ? 10 : 0,
                    width: window.innerWidth > 1024 ? '65vw' : window.innerWidth > 800 ? '90vw' : '100vw',
                    height: window.innerWidth > 1024 ? '75vh' : window.innerWidth > 800 ? '80vh' : '100vh'
                  }} 
                  position={{
                    depart: {
                      lat: latDest,
                      long: lngDest,
                      data: detailStore
                    },
                    dest: {
                      lat: latDep,
                      long: lngDep,
                    }
                  }}
                  mapOptions={mapOptionsItinerary}
                />
                <ChakraProvider>
                  <CloseButton size="lg" className={styles.dOverlayCloseButton} onClick={() => setDisplayItinerary({
                    type: 'ask',
                    response: false,
                  })} />
                </ChakraProvider>
              </div>
            </div>
          )
        }
      }
      return (
        <></>
      )
    }

    return (
      <>
      <div className={styles.dWrapper}>
        { displayDetail() }
      </div>
      {
        displayItinerary.type === 'fullfied' && displayItinerary.response ? (
          displayOverlay()
        ) : displayItinerary.type === 'pending' && !displayItinerary.response ? (
          <ChakraProvider>
            <Spinner label="Veuillez patienter..."></Spinner>
          </ChakraProvider>
        ) : (<></>)
      }
      </>
    );
}