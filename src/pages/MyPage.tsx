import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiMoreHorizontal } from 'react-icons/fi';
import { AiFillPlusCircle } from 'react-icons/ai';

import StyledButton from '../components/StyledButton';
import Styles from '../config/globalFontStyle.module.css';
import StyledCard from '../components/StyledCard';
import ReviewComponent from '../components/ReviewComponent';
import StyledModal from '../components/StyledModal';

interface Restaurant {
  _id: {
    timestamp: number;
    date: string;
  };
  restaurantId: number;
  name: string;
  cuisineType: string;
  avgPreference: number;
  address: string;
  roadAddress: string;
  number: string;
  businessHours: string;
  tags: string[][];
  imageFile: {
    timestamp: number;
    date: string;
  };
  menu: string[][];
  peculiarTaste: null;
  likeUserList: string[];
  imageUrl: string;
  xposition: number;
  yposition: number;
}
interface User {
  _id: {
    timestamp: number;
    date: string;
  };
  birthdate: string;
  email: string;
  gender: number;
  groupName: number | null;
  nickName: string;
  password: string;
  profileImage: string | null;
  Id: string;
}

const MypageContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;
const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  gap: 2.4rem;
  // max-width: 1440px;
  @media (max-width: 425px) {
    width: 100%;
  }
`;
const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2vw;
  align-items: center;
  width: 100%;
  @media (max-width: 425px) {
    flex-direction: column;
  }
`;
const Infocontent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  width: 100%;
`;

const Imgbox = styled.div`
  border-radius: 50%;
  border: 1px solid #dfdfdf;
  overflow: hidden;
  width: 14rem;
  height: 12rem;
  @media (max-width: 425px) {
    width: 20rem;
    height: 20rem;
  }
`;
const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
  width: 100%;
  @media (max-width: 425px) {
    justify-content: center;
  }
`;
const Rowbtn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;

  @media (max-width: 425px) {
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }
`;

const Info = styled.div`
  display: flex;
  width: 100%;
  @media (max-width: 425px) {
    justify-content: center;
  }
`;
const Line = styled.div`
  width: 100%;
  background-color: rgba(128, 128, 128, 0.3);
  height: 1px;
`;
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  column-gap: 4vh;
  row-gap: 4vh;
  width: 100%;
`;
interface BtnProps {
  clicked?: boolean;
}
const Btn = styled.button<BtnProps>`
  background-color: transparent;
  border: none;
  color: ${(props) => (props.clicked ? 'rgba(255, 137, 35, 0.6)' : 'black')};
  cursor: pointer;
  &:hover {
    color: rgba(255, 137, 35, 0.6);
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: #ffffff;
  box-shadow: 0.5rem 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0.5rem;
  padding: 1.2rem;
`;
const PlusIcon = styled(AiFillPlusCircle)`
  color: #9b9b9b;
`;
const Btncontainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 20rem;
`;

function Mypage() {
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalData, setModalData] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleModalData = (data: number) => {
    setModalData(data);
  };
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [tab, setTab] = useState<number>(0);
  const [renderCnt, setRenderCnt] = useState<number>(12);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [likedRestaurants, setLikedRestaurants] = useState<Restaurant[]>([]);
  const [User, setUser] = useState<User | null>(null);
  const { id } = useParams<{ id: string }>();
  const userId = sessionStorage.getItem('userId');

  let likedCount = 0;
  const totalReviews = restaurants.length; // 작성한 리뷰의 총 개수
  const totalLists = restaurants.length; // 맛플리의 총 개수
  const totalLikes = likedRestaurants.length; // 좋아요한 식당의 총 개수

  const ClickReview = () => {
    setTab(0);
    setRenderCnt(12);
  };
  const ClickLike = () => {
    setTab(2);
    setRenderCnt(12);
  };
  const ClickList = () => {
    setTab(1);
    setRenderCnt(12);
  };
  const fetchData = async () => {
    setIsLoaded(false);
    try {
      const response = await axios.get(`/restaurant/all`);
      setRestaurants(response.data);
      setIsLoaded(true);
      const liked = response.data.filter((restaurant: Restaurant) => {
        return id && restaurant.likeUserList && restaurant.likeUserList.includes(id);
      });
      setLikedRestaurants(liked);
    } catch (error) {
      console.error('Error fetching data', error);
      setIsLoaded(false);
    }
    try {
      const response = await axios.get(`/users/userId?userId=${userId}`);
      setUser(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common.Authorization = token;
    }
    fetchData();
  }, []);

  const toggleIsFollowing = () => {
    setIsFollowing(!isFollowing);
  };

  let button;

  if (userId === id) {
    button = (
      <Btncontainer>
        <StyledButton
          padding="0.8rem"
          borderRadius="0.4rem"
          onClick={() => {
            window.location.href = `/modify/${id}`;
          }}
        >
          <div className={Styles.p2bold}>프로필 편집</div>
        </StyledButton>
        <StyledButton
          padding="0.8rem"
          borderRadius="0.4rem"
          onClick={() => {
            window.location.href = `/mydetail/${id}`;
          }}
        >
          <div className={Styles.p2bold}>내 정보</div>
        </StyledButton>
      </Btncontainer>
    );
  } else if (isFollowing) {
    button = (
      <Btncontainer>
        <StyledButton padding="0.8rem" borderRadius="0.4rem" onClick={toggleIsFollowing}>
          <div className={Styles.p2bold}>팔로잉</div>
        </StyledButton>
      </Btncontainer>
    );
  } else {
    button = (
      <Btncontainer>
        <StyledButton padding="0.8rem" borderRadius="0.4rem" onClick={toggleIsFollowing}>
          <div className={Styles.p2bold}>팔로우</div>
        </StyledButton>
      </Btncontainer>
    );
  }

  return (
    <>
      <MypageContainer>
        <Container>
          <InfoContainer>
            <Imgbox>
              <Img
                src={User?.profileImage ? User.profileImage : 'https://cdn-icons-png.flaticon.com/512/1555/1555492.png'}
              />
            </Imgbox>
            <Infocontent>
              <Rowbtn>
                <div className={Styles.p1bold}>{id}</div>
                {button}
              </Rowbtn>
              <Row>
                <div className={Styles.p2bold}>작성한 리뷰 9</div>
                <div className={Styles.p2bold}>팔로워 10</div>
                <div className={Styles.p2bold}>팔로우 20</div>
              </Row>
              <Row>
                <div className={Styles.p2bold}>{User?.nickName}</div>
              </Row>
              <Info>
                <div className={Styles.p2regular}>안녕하세요. 저는 손성민 입니다.</div>
              </Info>
            </Infocontent>
          </InfoContainer>
          <Line />
          <Row>
            <Btn className={Styles.p1bold} onClick={ClickReview} clicked={tab === 0}>
              작성한 리뷰
            </Btn>
            <Btn className={Styles.p1bold} onClick={ClickList} clicked={tab === 1}>
              맛플리
            </Btn>
            <Btn className={Styles.p1bold} onClick={ClickLike} clicked={tab === 2}>
              좋아요한 식당
            </Btn>
          </Row>

          {isLoaded && tab === 0 ? (
            <GridContainer>
              {restaurants.map((restaurants: any, index) => (index < renderCnt ? <ReviewComponent /> : null))}
            </GridContainer>
          ) : null}
          {isLoaded && tab === 1 ? (
            <GridContainer>
              <Card className={Styles.h3medium}>
                <CardContent>
                  <PlusIcon />
                  <div style={{ color: '#9B9B9B' }}>맛플리 추가하기</div>
                </CardContent>
              </Card>
              {restaurants.map((restaurant: any, index) =>
                index < renderCnt - 1 ? (
                  <StyledCard restaurant={restaurant} icon={<FiMoreHorizontal size="2.4rem" />} showIconBox={false} />
                ) : null
              )}
            </GridContainer>
          ) : null}
          {isLoaded && tab === 2 ? (
            <GridContainer>
              {(() => {
                return likedRestaurants.map((restaurant: Restaurant) => {
                  if (likedCount < renderCnt) {
                    likedCount += 1;
                    return (
                      <StyledCard
                        restaurant={restaurant}
                        setModalData={handleModalData}
                        openModal={openModal}
                        key={restaurant.restaurantId}
                        updateLikedRestaurant={() => {
                          const updatedLikedRestaurants = likedRestaurants.filter(
                            (likedRestaurant: Restaurant) => likedRestaurant.restaurantId !== restaurant.restaurantId
                          );
                          setLikedRestaurants(updatedLikedRestaurants);
                        }}
                      />
                    );
                  }
                  return null;
                });
              })()}
            </GridContainer>
          ) : null}

          {(tab === 0 && renderCnt < totalReviews) ||
          (tab === 1 && renderCnt < totalLists) ||
          (tab === 2 && renderCnt < totalLikes) ? (
            <StyledButton
              onClick={() => {
                setRenderCnt((prev) => prev + 12);
              }}
              fontsize="1.2rem"
              padding="0.5rem 0"
            >
              더보기
            </StyledButton>
          ) : null}
        </Container>
      </MypageContainer>
      {showModal ? <StyledModal show={showModal} onClose={closeModal} data={modalData} modalRef={modalRef} /> : null}
    </>
  );
}

export default Mypage;
