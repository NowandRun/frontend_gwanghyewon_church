import React from 'react';
import { Box } from '@mui/material';
import CustomModal from './Modal';
import cashDiv from '../styles/images/cash.jpg';
import MyLogo from '../styles/images/wavenexus.png';

interface PriceProps {
  openPriceModal: () => void;
  isPriceModalOpen: boolean;
  closePriceModal: () => void;
}

const Price: React.FC<PriceProps> = ({
  isPriceModalOpen,
  openPriceModal,
  closePriceModal,
}) => {
  return (
    <div>
      <div
        className='w-11/12 rounded-2xl md:w-full mx-auto shadow-2xl cursor-pointer overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-95 flex flex-col'
        onClick={openPriceModal}
      >
        <span className='ml-5 text-2xl font-extrabold'>Price</span>
        <img className='object-cover h-64' src={cashDiv} alt='Intro-Section' />
      </div>
      <CustomModal isOpen={isPriceModalOpen} closeModal={closePriceModal}>
        <Box sx={{ border: 'none' }}>
          <div className='py-24 px-5'>
            <div className='flex justify-center mb-16'>
              <img
                src={MyLogo}
                alt='logo'
                className='h-16 max-h-full py-2 md:h-24'
              />
            </div>
            <div className='flex flex-col mt-5 pb-4'>
              <span className='md:text-2xl text-base w-11/12 mx-auto px-2 pb-1 md:pb-3 font-medium text-gray-500'>
                서비스 요청을 반영하여 제작하는
              </span>
              <span className='md:text-5xl text-3xl w-11/12 mx-auto px-2 pb-1 md:pb-3 font-bold text-gray-500'>
                디자인형 홈페이지
              </span>
            </div>

            <div className='my-5 grid justify-items-center'>
              <span className='text-lg w-11/12 mx-auto px-2 pb-3 font-semibold'>
                ✔️ 디자인편집형 홈페이지 구축비용 및 서비스
              </span>
              <table className='table-auto w-11/12 mx-auto px-2'>
                <thead>
                  <tr className='bg-gray-700 text-white'>
                    <th className='border border-gray-400 px-2 py-2 '>구분</th>
                    <th className='border border-gray-400 px-2 py-2'>
                      디자인편집형
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='text-center'>
                    <td className='border border-gray-400 px-2 py-2 font-bold'>
                      구축비용
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      1,000,000원
                    </td>
                  </tr>
                  <tr className='text-center'>
                    <td className='border border-gray-400 px-2 py-2 font-bold'>
                      제작내용
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      디자인화면 20p
                    </td>
                  </tr>
                  <tr className='text-center'>
                    <td className='border border-gray-400 px-2 py-2 font-bold'>
                      게시판
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>무제한</td>
                  </tr>
                  <tr className='text-center'>
                    <td className='border border-gray-400 px-2 py-2 font-bold'>
                      영상
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      무한생성, 유튜브 무료연동
                    </td>
                  </tr>
                  <tr className='text-center'>
                    <td className='border border-gray-400 px-2 py-2 font-bold'>
                      <span className='block'>콘텐츠</span>
                      <span className='block'>디자인</span>
                      <span className='block'>추가</span>
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      <span className='block'>
                        콘텐츠 메뉴 디자인을 추가로 요청하는 경우
                      </span>
                      <span className='block'>1p당 33,000원</span>
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-400 px-2 py-2 text-center font-bold'>
                      <span className='block'>제공</span>
                      <span className='block'>서비스</span>
                    </td>
                    <td className='border border-gray-400 px-2 py-2 text-center'>
                      <span className='block'>메뉴 무제한생성</span>
                      <span className='block'>
                        페이지 시안, 팝업시안 무료제공
                      </span>

                      <span className='block'>
                        타자만 칠수 있으면 누구나 홈페이지 내용수정
                      </span>
                      <span className='block'>
                        팝업창 제작이 가능한 관리솔류션
                      </span>
                      <span className='block'>디자인 시간 제공</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className='my-5 grid justify-items-center'>
              <span className='text-lg w-11/12 mx-auto px-2 pb-3 font-semibold'>
                ✔️ 유지보수
              </span>
              <div className='bg-blue-400 w-11/12 mx-auto text-center mb-3 py-3 text-white'>
                <span className='text-lg w-11/12 mx-auto px-2 pb-3 font-semibold'>
                  셀프관리(필수)
                </span>
              </div>
              <table className='table-auto w-11/12 mx-auto px-2'>
                <tbody>
                  <tr className='text-center'>
                    <td className='bg-gray-700 w-28 text-white border border-gray-400 px-2 py-2 font-bold'>
                      비용
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      22,000원/월
                    </td>
                  </tr>
                  <tr className='text-center'>
                    <td className='bg-gray-700 w-28 text-white  border border-gray-400 px-2 py-2 font-bold'>
                      웹서버
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>10GB</td>
                  </tr>
                  <tr>
                    <td className='bg-gray-700 w-28 text-white border text-center border-gray-400 px-2 py-2 font-bold'>
                      공통서비스
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      <ul className='list-disc pl-4'>
                        <li>셀프관리가 가능한 CMS시스템 제공</li>
                        <li>게시판/앨범게시판 직접 추가 가능</li>
                        <li>메인 상단 이미지 직접 변경 가능</li>
                        <li style={{ listStyleType: 'none' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              width: '1em',
                              marginLeft: '-1em',
                            }}
                          >
                            ※
                          </span>
                          셀프관리 CMS시스템은 특별한 기술이 없어도 한글문서,
                          파워포인트 문서 작성처럼 사용자가 직접 수정관리를 할
                          수 있음
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className='bg-gray-700 w-28 text-center text-white border border-gray-400 px-2 py-2 font-bold'>
                      서비스
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      <ul className='list-disc pl-4'>
                        <li>
                          제작완료 후 관리자모드 사용법 교육(원격지원포함)
                        </li>
                        <li>100% 직접관리하는 셀프운영</li>
                        <li>
                          <span className='block'>
                            전담커뮤니케이터 1:1대응 미지원
                          </span>
                          <span className='block'>
                            (전화상담 및 질의상담전화 미지원)
                          </span>
                        </li>
                        <li>
                          문의사항, 질의사항, 사용법문의는 관리자모드 CMS의
                          Q&A게시판을 통한 문의/답변 지원
                        </li>
                        <li>원격 미지원</li>
                        <li>운영관리 매뉴얼(설명서, 동영상)지원</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className='bg-blue-400 w-11/12 mx-auto text-center mb-3 py-3 text-white mt-5'>
                <span className='text-lg w-11/12 mx-auto px-2 pb-3 font-semibold'>
                  필요시 관리서비스 추가(선택)
                </span>
              </div>

              <div className='flex rounded-2xl flex-col w-11/12 mx-auto items-center justify-center bg-yellow-100'>
                <div className='py-7 flex flex-col items-center justify-center'>
                  <span className='block text-lg  mx-auto px-2 pb-3 font-semibold '>
                    커뮤니케이터 지원관리
                  </span>
                  <span className='block text-sm  mx-auto px-2 pb-3 font-semibold '>
                    (선택, 기본3개월 추천)
                  </span>
                </div>

                <table className='table-auto w-full  mx-auto px-2 bg-white'>
                  <tbody>
                    <tr className='text-center'>
                      <td className='bg-gray-700 w-28 text-white border border-gray-400 px-2 py-2 font-bold'>
                        비용
                      </td>
                      <td className='border border-gray-400 px-2 py-2'>
                        셀프관리 + 33,000원/월
                      </td>
                    </tr>
                    <tr className='text-center'>
                      <td className='bg-gray-700 w-28 text-white  border border-gray-400 px-2 py-2 font-bold'>
                        웹서버
                      </td>
                      <td className='border border-gray-400 px-2 py-2'>10GB</td>
                    </tr>
                    <tr>
                      <td className='bg-gray-700 w-28 text-white border text-center border-gray-400 px-2 py-2 font-bold'>
                        영상서버
                      </td>
                      <td className='border border-gray-400 px-2 py-2'>-</td>
                    </tr>
                    <tr>
                      <td className='bg-gray-700 w-28 text-center text-white border border-gray-400 px-2 py-2 font-bold'>
                        서비스
                      </td>
                      <td className='border border-gray-400 px-2 py-2'>
                        <span className='block text-lg font-semibold'>
                          셀프관리 공통서비스 기본제공 +
                        </span>
                        <ul className='list-disc pl-4'>
                          <li>관리자모드 사용법추가교육(상시)</li>
                          <li>원격지원</li>
                          <li>
                            <span className='block'>
                              전담커뮤니케이터 1:1대응
                            </span>
                          </li>
                          <li>시즌별 요금변경 및 홈페이지내 텍스트 수정</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className='flex rounded-2xl flex-col w-11/12 mx-auto items-center justify-center bg-green-100 mt-5'>
                <div className='py-7 flex flex-col items-center justify-center'>
                  <span className='block text-lg  mx-auto px-2 pb-3 font-semibold '>
                    전문관리 유지보수
                  </span>
                  <span className='block text-sm  mx-auto px-2 pb-3 font-semibold '>
                    (선택)
                  </span>
                </div>

                <table className='table-auto w-full  mx-auto px-2 bg-white'>
                  <tbody>
                    <tr className='text-center'>
                      <td className='bg-gray-700 w-28 text-white border border-gray-400 px-2 py-2 font-bold'>
                        비용
                      </td>
                      <td className='border border-gray-400 px-2 py-2'>
                        셀프관리 + 55,000원/월
                      </td>
                    </tr>
                    <tr className='text-center'>
                      <td className='bg-gray-700 w-28 text-white  border border-gray-400 px-2 py-2 font-bold'>
                        웹서버
                      </td>
                      <td className='border border-gray-400 px-2 py-2'>10GB</td>
                    </tr>
                    <tr>
                      <td className='bg-gray-700 w-28 text-white border text-center border-gray-400 px-2 py-2 font-bold'>
                        영상서버
                      </td>
                      <td className='border border-gray-400 px-2 py-2'>10GB</td>
                    </tr>
                    <tr>
                      <td className='bg-gray-700 w-28 text-center text-white border border-gray-400 px-2 py-2 font-bold'>
                        서비스
                      </td>
                      <td className='border border-gray-400 px-2 py-2'>
                        <span className='block text-lg font-semibold'>
                          커뮤니케이터지원관리 서비스 기본제공 +
                        </span>
                        <ul className='list-disc pl-4'>
                          <li>텍스트내용수정 2회/월</li>
                          <li>이미지수정교체 3회/월</li>
                          <li>
                            <span className='block'>팝업창제작 3회/월</span>
                          </li>
                          <li style={{ listStyleType: 'none' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                width: '1em',
                                marginLeft: '-1em',
                              }}
                            >
                              ※
                            </span>
                            총 작업소요시간 1.5시간이내 작업으로 작업량에 따라
                            횟수가 조정될 수 있습니다.
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className='my-5 grid justify-items-center'>
              <span className='text-lg w-11/12 mx-auto px-2 pb-3 font-semibold'>
                ✔️ 도메인 구매비용
              </span>
              <table className='table-auto w-11/12 mx-auto px-2'>
                <thead>
                  <tr className='bg-gray-700 text-white'>
                    <th className='border border-gray-400 px-2 py-2 '>종류</th>
                    <th className='border border-gray-400 px-2 py-2'>
                      등록비용(1년)
                    </th>
                    <th className='border border-gray-400 px-2 py-2 '>설명</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='border border-gray-400 px-2 py-2 font-bold'>
                      .com
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      23,500원
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      일반적으로 가장 많이 사용되는 최상위 도메인입니다.
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-400 px-2 py-2 font-bold'>
                      .net
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      23,000원
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      .com과 더불어 많이 사용되며 특별한 등록 조건은 없습니다.
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-400 px-2 py-2 font-bold'>
                      .org
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      22,000원
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      비영리, 기관, 단체를 의미하는 도메인입니다.
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-400 px-2 py-2 font-bold'>
                      .biz
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      22,000원
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      business의 약자로, 주로 기업용 도메인으로 사용되는
                      도메인입니다.
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-400 px-2 py-2 font-bold'>
                      .info
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      23,600원
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      information의 약자로, 정보제공을 목적으로 하는 사이트에
                      주로 사용됩니다.
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-400 px-2 py-2 font-bold'>
                      .name
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      28,600원
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      개인의 이름이나 브랜드명 등에 사용됩니다.
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-400 px-2 py-2 font-bold'>
                      .asia
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      55,000원
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      아시아 네트워크 통합을 목적으로 한 도메인입니다
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-400 px-2 py-2 font-bold'>
                      .닷컴
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      22,000원
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      가장 인기있는 .com의 한글버전 최상위 도메인입니다.
                    </td>
                  </tr>
                  <tr>
                    <td className='border border-gray-400 px-2 py-2 font-bold'>
                      .닷넷
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      22,000원
                    </td>
                    <td className='border border-gray-400 px-2 py-2'>
                      많이 사용되는 .net의 한글버전 최상위 도메인입니다.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='text-lg w-11/12 mx-auto '>
              <span className='block text-lg  mx-auto   font-semibold'>
                필요시 추가 유지보수 요청시 비용
              </span>
              <span className='block text-base  mx-auto '>
                계약된 서비스 외에 추가로 서비스를 요청하실 경우의 비용
              </span>
              <table className='table-auto w-full  mx-auto px-2 bg-white'>
                <tbody>
                  <tr>
                    <td className='w-1  border border-none px-2 py-2 font-bold'>
                      ☑️
                    </td>
                    <td className='border border-none px-2 py-2'>
                      텍스트 페이지 내용수정 11,000원/1page ~
                    </td>
                  </tr>
                  <tr>
                    <td className='w-1   border border-none px-2 py-2 font-bold'>
                      ☑️
                    </td>
                    <td className='border border-none px-2 py-2'>
                      팝업창 1건 33,000원/1개 ~
                    </td>
                  </tr>
                  <tr>
                    <td className='w-1  border text-center border-none px-2 py-2 font-bold'>
                      ☑️
                    </td>
                    <td className='border border-none px-2 py-2'>
                      <span className='block'>
                        연 업데이트 작업요청 110,000원/1건 ~
                      </span>
                      <span className='block'>
                        ※ 수정작업 분량에 따라 비용이 추가될 수 있습니다.
                      </span>
                      <span className='block'>
                        (주문제작형 홈페이지 수정은 수정 분량과 범위에 따라 별도
                        견적)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='text-lg w-11/12 mx-auto mb-24'>
              <span className='block text-lg  mx-auto   font-semibold'>
                필요시 서버용량 추가
              </span>
              <span className='block text-base  mx-auto '>
                계약 시 제공되는 서버용량 외에 추가로 필요한 용량을 증설할 수
                있습니다.
              </span>
              <table className='table-auto w-full  mx-auto px-2 bg-white'>
                <tbody>
                  <tr>
                    <td className='w-1  border border-none px-2 py-2 font-bold'>
                      ☑️
                    </td>
                    <td className='border border-none px-2 py-2'>
                      웹서버 용량추가:10GB 추가 시 11,000원/월
                    </td>
                  </tr>
                  <tr>
                    <td className='w-1   border border-none px-2 py-2 font-bold'>
                      ☑️
                    </td>
                    <td className='border border-none px-2 py-2'>
                      동영상 서버 용량추가:10GB 추가 시 11,000원/월
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className='font-semibold text-2xl mt-3'>
                <span>문의전화: 010-2915-3782</span>
              </div>
            </div>
          </div>
        </Box>
      </CustomModal>
    </div>
  );
};

export default Price;
