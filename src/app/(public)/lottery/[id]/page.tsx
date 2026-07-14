'use client';

import defaultImage from '@/../public/images/man-global/nf1.png';

// URL del placeholder para fallback de imágenes
const PLACEHOLDER_IMAGE = '/images/man-global/nf1.png';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BarbellIcon,
  CalendarIcon,
  ClockIcon,
  ShoppingCartIcon,
  StarIcon,
  TagIcon,
  TicketIcon,
  TrophyIcon,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import { lotteryService } from '@/services';
import { Lottery, LotteryStatus, LotteryType } from '@/interfaces/lottery';
import NavbarBlack from '@/components/navbar/NavbarBlack';
import Jewellery1Footer from '@/components/landing-jewellery1/Jewellery1Footer';
import MotionFade from '@/components/motionEffect/MotionFade';
import { useLotteryHub } from '@/hooks/lottery-hub';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/store/cartStore';
import { CartSidebar, CartButton } from '@/components/cart';
import { useNotificationStore } from '@/store/notificationStore';
import { getLotteryText, getPrizeText } from '@/utils/localizedContent';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

const LotteryDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const lotteryId = params.id as string;

  // Check authentication status (auth handled via HttpOnly cookies)
  const { isAuthenticated, hasRole } = useAuth();

  // Estado: { número: cantidad }
  const [selectedNumbers, setSelectedNumbers] = useState<Record<number, number>>({});
  const [pick3Number, setPick3Number] = useState<string>('');
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  // Paginación y búsqueda del tablero de números (rifas grandes, ej. 0000-9999)
  const [numberPage, setNumberPage] = useState(0);
  const [numberSearch, setNumberSearch] = useState('');

  // Cart store
  const { addItem: addCartItem, setIsOpen: setCartOpen } = useCartStore();
  const showNotification = useNotificationStore(state => state.show);

  const {
    data: lottery,
    isLoading,
    error,
  } = useQuery<Lottery, Error>({
    queryKey: ['lottery', lotteryId],
    queryFn: async () => {
      return lotteryService.getLotteryById(lotteryId);
    },
    enabled: !!lotteryId,
  });

  // Conexión WebSocket al LotteryHub (auth via HttpOnly cookies)
  const {
    availableNumbers,
    reservations,
    currentOrder,
    error: hubError,
    isConnected,
    reserveNumbersWithOrder,
    clearError,
    clearReservations: _clearReservations, // Para uso futuro
    clearCurrentOrder: _clearCurrentOrder, // Para uso futuro
  } = useLotteryHub(lotteryId, lottery?.totalSeries);

  // Estado de carga para reservas
  const [isReserving, setIsReserving] = useState(false);

  // Log de conexión WebSocket para debug
  useEffect(() => {
    if (isConnected) {
      console.log('✅ WebSocket conectado a la lotería:', lotteryId);
      console.log('📊 Números disponibles:', availableNumbers.length);
    }
  }, [isConnected, lotteryId, availableNumbers.length]);

  // Mostrar errores del hub
  useEffect(() => {
    if (hubError) {
      console.error('❌ Error del hub:', hubError);
    }
  }, [hubError]);

  // Log de reservas confirmadas
  useEffect(() => {
    if (reservations.length > 0) {
      console.log('🎫 Reservas confirmadas:', reservations);
    }
  }, [reservations]);

  // Pick3: detect game type and sync inputs to selectedNumbers
  const isPick3 = lottery?.type === LotteryType.Pick3;

  // Dígitos para mostrar los números (Pick3: 3, rifas 0000-9999: 4, legacy 00-99: 2)
  const numberDigits = isPick3 ? 3 : Math.max(2, String(lottery?.maxNumber ?? 99).length);

  // Índice de disponibilidad por número (el hub solo envía números no completamente disponibles)
  const availableByNumber = useMemo(
    () => new Map(availableNumbers.map(n => [n.number, n])),
    [availableNumbers]
  );

  useEffect(() => {
    if (!isPick3) return;
    const newSelected: Record<number, number> = {};
    const num = parseInt(pick3Number, 10);
    if (pick3Number !== '' && !isNaN(num) && num >= 0 && num <= 999) {
      newSelected[num] = 1;
    }
    setSelectedNumbers(newSelected);
  }, [pick3Number, isPick3]);

  // Calcular días restantes
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return t('LOTTERY_DETAILS.finished', 'Finalizado');
    if (days === 0) return t('LOTTERY_DETAILS.today', 'Hoy');
    if (days === 1) return t('LOTTERY_DETAILS.oneDay', '1 Día');
    return `${days} ${t('LOTTERY_DETAILS.days', 'Días')}`;
  };

  // Calcular porcentaje vendido
  const getSoldPercentage = (sold: number, max: number) => {
    if (max === 0) return 0;
    return parseFloat(((sold / max) * 100).toFixed(2));
  };

  // Formatear fecha del sorteo
  const formatDrawDate = (endDate: string) => {
    const date = new Date(endDate);
    return {
      dayName: date.toLocaleDateString('es-ES', { weekday: 'long' }),
      date: date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  // Obtener estado de la lotería
  const getStatusText = (status: LotteryStatus) => {
    switch (status) {
      case LotteryStatus.Active:
        return t('LOTTERY_DETAILS.status.active', 'Activa');
      case LotteryStatus.Draft:
        return t('LOTTERY_DETAILS.status.draft', 'Borrador');
      case LotteryStatus.Paused:
        return t('LOTTERY_DETAILS.status.paused', 'Pausada');
      case LotteryStatus.Completed:
        return t('LOTTERY_DETAILS.status.completed', 'Completada');
      case LotteryStatus.Cancelled:
        return t('LOTTERY_DETAILS.status.cancelled', 'Cancelada');
      default:
        return '';
    }
  };

  // Obtener series disponibles para un número
  const getAvailableSeries = (num: number): number => {
    const hubNumber = availableByNumber.get(num);
    // Si hay info del hub, usar availableSeries; sino, el número está completamente disponible
    return hubNumber?.availableSeries ?? lottery?.totalSeries ?? 1;
  };

  // Manejar click en número (toggle selección)
  const handleNumberClick = (num: number) => {
    const available = getAvailableSeries(num);

    // Si no hay series disponibles, no permitir seleccionar
    if (available <= 0) {
      showNotification('warning', t('LOTTERY_DETAILS.noSeriesAvailable', 'No hay series disponibles'), '');
      return;
    }

    setSelectedNumbers(prev => {
      const newState = { ...prev };
      if (newState[num]) {
        delete newState[num];
      } else {
        newState[num] = 1;
      }
      return newState;
    });
  };

  // Aumentar cantidad de un número
  const increaseQuantity = (num: number) => {
    const available = getAvailableSeries(num);
    const current = selectedNumbers[num] || 0;

    // Validar que no exceda las series disponibles
    if (current >= available) {
      showNotification(
        'warning',
        t('LOTTERY_DETAILS.maxSeriesReached', 'Límite alcanzado'),
        t('LOTTERY_DETAILS.onlyXSeriesAvailable', 'Solo hay {{count}} series disponibles para este número', {
          count: available,
        })
      );
      return;
    }

    setSelectedNumbers(prev => ({
      ...prev,
      [num]: current + 1,
    }));
  };

  // Disminuir cantidad de un número
  const decreaseQuantity = (num: number) => {
    setSelectedNumbers(prev => {
      const current = prev[num] || 0;
      if (current <= 1) {
        const newState = { ...prev };
        delete newState[num];
        return newState;
      }
      return { ...prev, [num]: current - 1 };
    });
  };

  // Eliminar número completamente
  const removeNumber = (num: number) => {
    setSelectedNumbers(prev => {
      const newState = { ...prev };
      delete newState[num];
      return newState;
    });
  };

  // Limpiar selección
  const clearSelection = () => {
    setSelectedNumbers({});
    setPick3Number('');
  };

  // Referencia para tracking de reservas pendientes
  const pendingReservationRef = useRef<{
    numbers: Array<{ number: number; quantity: number }>;
    resolve: () => void;
    reject: (error: Error) => void;
  } | null>(null);

  // Escuchar confirmación del hub para agregar al carrito
  useEffect(() => {
    if (currentOrder && pendingReservationRef.current && lottery) {
      const { numbers, resolve } = pendingReservationRef.current;

      // La orden fue confirmada, ahora sí agregar al carrito
      addCartItem({
        lotteryId: lottery.lotteryGuid,
        lotteryName: lottery.title,
        lotteryTranslations: lottery.translations,
        lotteryImage: lottery.prizes?.[0]?.mainImageUrl,
        lotteryType: lottery.type,
        lotteryMaxNumber: lottery.maxNumber,
        ticketPrice: lottery.ticketPrice,
        numbers,
        orderId: currentOrder.orderId,
        orderExpiresAt: Date.now() + currentOrder.secondsRemaining * 1000,
      });

      // Limpiar selección y mostrar notificación
      clearSelection();
      showNotification(
        'success',
        t('CART.addedSuccess', 'Agregado al carrito'),
        t('CART.numbersReserved', 'Números reservados por 5 minutos')
      );
      setCartOpen(true);
      setIsReserving(false);

      // Limpiar la referencia pendiente y resolver la promesa
      pendingReservationRef.current = null;
      resolve();
    }
  }, [currentOrder, lottery, addCartItem, showNotification, t, setCartOpen]);

  // Agregar al carrito y reservar números via SignalR
  const handleAddToCart = async () => {
    console.log('🛒 handleAddToCart called');

    const selectedEntries = Object.entries(selectedNumbers);
    const ticketQuantity = selectedEntries.reduce((sum, [, qty]) => sum + qty, 0);

    if (!lottery || ticketQuantity === 0) {
      console.log('⚠️ Early return: no lottery or ticketQuantity === 0');
      return;
    }

    // Verificar autenticación
    if (!isAuthenticated) {
      console.log('⚠️ Not authenticated - showing login notification');
      showNotification(
        'warning',
        t('AUTH.loginRequired', 'Inicio de sesión requerido'),
        t('AUTH.loginToBuy', 'Inicie sesión para comprar boletos')
      );
      return;
    }

    // Verificar que no sea administrador
    if (hasRole('admin')) {
      showNotification(
        'warning',
        t('CART.adminRestricted', 'Acción no permitida'),
        t('CART.adminCannotBuy', 'Los administradores no pueden comprar boletos')
      );
      return;
    }

    // Verificar conexión al hub
    if (!isConnected) {
      console.log('⚠️ Not connected to hub');
      showNotification(
        'error',
        t('CART.reservationError', 'Error al reservar'),
        t('CART.noConnection', 'No hay conexión con el servidor')
      );
      return;
    }

    const numbers = selectedEntries.map(([num, qty]) => ({
      number: Number(num),
      quantity: qty,
    }));

    // Pick3: exactly 1 number (3-digit), quantity 1
    if (lottery.type === LotteryType.Pick3) {
      if (numbers.length !== 1) {
        showNotification(
          'warning',
          t('CART.pick3NumberRequired', 'Selecciona tu número'),
          t('CART.pick3MustSelect1', 'Debes seleccionar un número de 3 dígitos (000-999)')
        );
        return;
      }
    }

    console.log('📤 Numbers to reserve:', numbers);
    setIsReserving(true);

    try {
      // Usar el orderId existente si hay una orden en progreso
      const existingOrderId = currentOrder?.orderId;
      console.log('📋 Existing order ID:', existingOrderId);

      // Crear promesa que se resolverá cuando llegue la confirmación del hub
      const reservationPromise = new Promise<void>((resolve, reject) => {
        pendingReservationRef.current = { numbers, resolve, reject };

        // Timeout de 30 segundos
        setTimeout(() => {
          if (pendingReservationRef.current) {
            console.log('⏰ Timeout waiting for server confirmation');
            pendingReservationRef.current = null;
            reject(new Error('Timeout esperando confirmación del servidor'));
          }
        }, 30000);
      });

      console.log('🚀 Calling reserveNumbersWithOrder...');
      // Reservar todos los números de una sola vez via SignalR
      await reserveNumbersWithOrder(numbers, existingOrderId);
      console.log('✅ reserveNumbersWithOrder completed, waiting for hub confirmation...');

      // Esperar la confirmación del servidor (evento ReservationWithOrderConfirmed)
      await reservationPromise;
      console.log('🎉 Reservation confirmed by server!');
    } catch (error) {
      console.error('❌ Error al reservar números:', error);
      pendingReservationRef.current = null;
      showNotification(
        'error',
        t('CART.reservationError', 'Error al reservar'),
        t('CART.tryAgain', 'Intenta nuevamente')
      );
      setIsReserving(false);
    }
  };

  // Comprar ahora (agregar y abrir carrito)
  const handleBuyNow = () => {
    handleAddToCart();
    // Aquí podrías redirigir al checkout directamente
  };

  // Formatear número según tipo de lotería (rellena con ceros según el rango)
  const formatNumber = (num: number): string => {
    return num.toString().padStart(numberDigits, '0');
  };

  // Validar si una URL de imagen es válida
  const isValidImageUrl = (url: string | undefined | null): boolean => {
    if (!url || typeof url !== 'string') return false;
    // Verificar que sea una URL válida o path relativo
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
  };

  // Obtener todas las imágenes del premio
  const getAllImages = () => {
    if (!lottery?.prizes?.[0]) return [];
    const prize = lottery.prizes[0];
    const images: { url: string; caption: string }[] = [];

    const prizeName = getPrizeText(prize, 'name', i18n.language);

    if (isValidImageUrl(prize.mainImageUrl)) {
      images.push({ url: prize.mainImageUrl, caption: prizeName });
    }

    if (prize.additionalImages?.length) {
      prize.additionalImages.forEach(img => {
        if (isValidImageUrl(img.imageUrl)) {
          images.push({ url: img.imageUrl, caption: img.caption || prizeName });
        }
      });
    }

    return images;
  };

  if (isLoading) {
    return (
      <div>
        <NavbarBlack />
        <section className="contest-carslide-section bg1-color position-relative pt-120 pb-120">
          <div className="container">
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
              <div className="text-center">
                <div className="spinner-border text-primary mb-3" aria-live="polite">
                  <span className="visually-hidden">{t('COMMON.loading', 'Cargando...')}</span>
                </div>
                <p className="nw2-clr">{t('LOTTERY_DETAILS.loading', 'Cargando detalles de la promoción...')}</p>
              </div>
            </div>
          </div>
        </section>
        <Jewellery1Footer />
      </div>
    );
  }

  if (error || !lottery) {
    return (
      <div>
        <NavbarBlack />
        <section className="bg1-color pt-120 pb-120">
          <div className="container">
            <div className="text-center" style={{ minHeight: '400px' }}>
              <h3 className="nw1-clr mb-4">{t('LOTTERY_DETAILS.notFound', 'Promoción no encontrada')}</h3>
              <p className="nw2-clr mb-4">
                {t('LOTTERY_DETAILS.notFoundDesc', 'La promoción que buscas no existe o ha sido eliminada.')}
              </p>
              <Link href="/landing-page" className="kewta-btn d-inline-flex align-items-center">
                <span className="kew-text p1-bg n4-clr">{t('COMMON.backToHome', 'Volver al inicio')}</span>
              </Link>
            </div>
          </div>
        </section>
        <Jewellery1Footer />
      </div>
    );
  }

  const mainPrize = lottery.prizes?.[0];
  // Textos configurables resueltos al idioma seleccionado (fallback: español base)
  const lotteryTitle = getLotteryText(lottery, 'title', i18n.language);
  const lotteryDescription = getLotteryText(lottery, 'description', i18n.language);
  const lotteryTerms = getLotteryText(lottery, 'terms', i18n.language);
  const images = getAllImages();
  const soldPercent = getSoldPercentage(lottery.soldTickets, lottery.maxTickets);
  const remaining = lottery.maxTickets - lottery.soldTickets;
  const drawInfo = formatDrawDate(lottery.endDate);

  // Calcular totales desde el objeto de selección
  const selectedEntries = Object.entries(selectedNumbers);
  const ticketQuantity = selectedEntries.reduce((sum, [, qty]) => sum + qty, 0);
  const totalPrice = (lottery.ticketPrice * ticketQuantity).toFixed(2);

  // Tablero paginado: con rangos grandes (ej. 10,000 números) no se renderiza todo de golpe
  const NUMBERS_PAGE_SIZE = 100;
  const totalNumbers = lottery.maxNumber - lottery.minNumber + 1;
  const totalNumberPages = Math.ceil(totalNumbers / NUMBERS_PAGE_SIZE);
  const isSearching = numberSearch.trim() !== '';

  let visibleNumbers: number[];
  if (isSearching) {
    // Buscar números cuya representación (con ceros) empiece por lo escrito, ej. "75" → 7500-7599
    const query = numberSearch.trim();
    visibleNumbers = [];
    for (let n = lottery.minNumber; n <= lottery.maxNumber && visibleNumbers.length < NUMBERS_PAGE_SIZE; n++) {
      if (String(n).padStart(numberDigits, '0').startsWith(query)) {
        visibleNumbers.push(n);
      }
    }
  } else {
    const clampedPage = Math.min(numberPage, totalNumberPages - 1);
    const pageStart = lottery.minNumber + clampedPage * NUMBERS_PAGE_SIZE;
    const pageEnd = Math.min(pageStart + NUMBERS_PAGE_SIZE - 1, lottery.maxNumber);
    visibleNumbers = Array.from({ length: pageEnd - pageStart + 1 }, (_, i) => pageStart + i);
  }

  const pageRangeLabel = visibleNumbers.length > 0
    ? `${formatNumber(visibleNumbers[0])} – ${formatNumber(visibleNumbers[visibleNumbers.length - 1])}`
    : '';

  // Debug: Estado del botón "Agregar al carrito"
  const pick3NumberValue = isPick3 ? parseInt(pick3Number, 10) : NaN;
  const pick3NumInfo = isPick3 && !isNaN(pick3NumberValue)
    ? availableByNumber.get(pick3NumberValue)
    : null;
  const isPick3Unavailable = isPick3 && pick3NumInfo?.isExhausted === true;

  const isAddToCartDisabled =
    lottery.status !== LotteryStatus.Active ||
    remaining === 0 ||
    ticketQuantity === 0 ||
    isReserving ||
    !isAuthenticated ||
    !isConnected ||
    hasRole('admin') ||
    isPick3Unavailable;

  return (
    <div>
      <NavbarBlack />

      {/* Contest Car Slide Section */}
      <section className="contest-carslide-section bg1-color position-relative pt-120 pb-60">
        <div className="container">
          {/* Main Image Slider */}
          <div className="contest-details-carslidewrap position-relative bg2-color radius24 overflow-hidden mb-6">
            {images.length > 1 ? (
              <Swiper
                modules={[Navigation, Thumbs, FreeMode]}
                navigation={{
                  prevEl: '.contest-prev',
                  nextEl: '.contest-next',
                }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                className="contest-main-slider"
              >
                {images.map(img => (
                  <SwiperSlide key={img.url}>
                    <div className="cons-decar-items py-xxl-10 py-8">
                      <Image
                        src={img.url}
                        alt={img.caption || lotteryTitle}
                        width={850}
                        height={500}
                        className="w-100"
                        style={{ objectFit: 'contain', maxHeight: '500px' }}
                        onError={e => {
                          const target = e.target as HTMLImageElement;
                          target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="cons-decar-items py-xxl-10 py-8">
                {isValidImageUrl(mainPrize?.mainImageUrl) ? (
                  <Image
                    src={mainPrize?.mainImageUrl || PLACEHOLDER_IMAGE}
                    alt={lotteryTitle}
                    width={850}
                    height={500}
                    className="w-100"
                    style={{ objectFit: 'contain', maxHeight: '500px' }}
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                ) : (
                  <Image
                    src={defaultImage}
                    alt={lotteryTitle}
                    width={850}
                    height={500}
                    className="w-100"
                    style={{ objectFit: 'contain', maxHeight: '500px' }}
                  />
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <div className="click-slideluxry-button d-flex align-items-center justify-content-between w-100 px-4">
                <button className="contest-prev cmn-60 d-center radius-circle n0-bg">
                  <ArrowLeftIcon className="fs-four n4-clr" weight="bold" />
                </button>
                <button className="contest-next cmn-60 d-center radius-circle n0-bg">
                  <ArrowRightIcon className="fs-four n4-clr" weight="bold" />
                </button>
              </div>
            )}
          </div>

          {/* Thumbnail Slider */}
          {images.length > 1 && (
            <div className="contest-thumbs-wrapper mb-8">
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[FreeMode, Thumbs]}
                spaceBetween={16}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                breakpoints={{
                  320: { slidesPerView: 2 },
                  576: { slidesPerView: 3 },
                  768: { slidesPerView: 4 },
                  1200: { slidesPerView: 5 },
                }}
                className="contest-thumbs-slider"
              >
                {images.map(img => (
                  <SwiperSlide key={`thumb-${img.url}`}>
                    <div
                      className="thumb-ticketbig position-relative cursor-pointer"
                      style={{ height: '120px', cursor: 'pointer' }}
                    >
                      <Image
                        src={img.url}
                        alt={img.caption || lotteryTitle}
                        width={200}
                        height={120}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                        onError={e => {
                          const target = e.target as HTMLImageElement;
                          target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </section>

      {/* Contest Details Section */}
      <section className="bg1-color pb-120">
        <div className="container">
          <div className="row g-6">
            {/* Left Column - Lottery Info */}
            <div className="col-lg-8">
              <MotionFade>
                <div className="ans-qustion-wrap">
                  {/* Header */}
                  <div className="ans-title d-flex flex-wrap align-items-center justify-content-between gap-3 p-xxl-6 p-4">
                    <div>
                      <span className="badge act4-bg n0-clr fs-eight fw_600 mb-2">{getStatusText(lottery.status)}</span>
                      <h2 className="n4-clr fw_700">{lotteryTitle}</h2>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <CalendarIcon className="fs-four act4-clr" />
                      <div>
                        <span className="d-block fs-eight n3-clr">{t('LOTTERY_DETAILS.draw', 'Promoción')}</span>
                        <span className="fw_700 n4-clr">
                          {drawInfo.dayName} {drawInfo.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-xxl-6 p-4">
                    {/* Prize Info */}
                    {mainPrize && (
                      <div className="mb-6">
                        <h4 className="n4-clr fw_700 mb-3 d-flex align-items-center gap-2">
                          <TrophyIcon className="fs-four act4-clr" />
                          {t('LOTTERY_DETAILS.prize', 'Premio Principal')}
                        </h4>
                        <div className="n0-bg radius16 p-4">
                          <h3 className="act4-clr fw_700 mb-2">{getPrizeText(mainPrize, 'name', i18n.language)}</h3>
                          <p className="n3-clr mb-3">{getPrizeText(mainPrize, 'description', i18n.language)}</p>
                          {mainPrize.estimatedValue > 0 && (
                            <div className="d-flex flex-wrap gap-4">
                              <div>
                                <span className="d-block fs-eight n3-clr">
                                  {t('LOTTERY_DETAILS.estimatedValue', 'Valor estimado')}
                                </span>
                                <span className="fs-four fw_700 s1-clr">
                                  ${mainPrize.estimatedValue.toLocaleString()}
                                </span>
                              </div>
                              {mainPrize.cashAlternative && (
                                <div>
                                  <span className="d-block fs-eight n3-clr">
                                    {t('LOTTERY_DETAILS.cashAlternative', 'Alternativa en efectivo')}
                                  </span>
                                  <span className="fs-four fw_700 act4-clr">
                                    ${mainPrize.cashAlternative.toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div className="mb-6">
                      <h4 className="n4-clr fw_700 mb-3">{t('LOTTERY_DETAILS.description', 'Descripción')}</h4>
                      <p className="n3-clr fs-six">{lotteryDescription}</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="row g-4 mb-6">
                      <div className="col-sm-6 col-md-3">
                        <div className="n0-bg radius12 p-3 text-center">
                          <ClockIcon className="fs-two act4-clr mb-2" />
                          <span className="d-block fs-eight n3-clr">
                            {t('LOTTERY_DETAILS.timeRemaining', 'Tiempo restante')}
                          </span>
                          <span className="fw_700 n4-clr">{getDaysRemaining(lottery.endDate)}</span>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-3">
                        <div className="n0-bg radius12 p-3 text-center">
                          <TicketIcon className="fs-two act4-clr mb-2" />
                          <span className="d-block fs-eight n3-clr">
                            {t('LOTTERY_DETAILS.totalTickets', 'Total tickets')}
                          </span>
                          <span className="fw_700 n4-clr">{lottery.maxTickets.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-3">
                        <div className="n0-bg radius12 p-3 text-center">
                          <BarbellIcon className="fs-two act4-clr mb-2" />
                          <span className="d-block fs-eight n3-clr">
                            {t('LOTTERY_DETAILS.remaining', 'Disponibles')}
                          </span>
                          <span className="fw_700 s1-clr">{remaining.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-3">
                        <div className="n0-bg radius12 p-3 text-center">
                          <StarIcon className="fs-two act4-clr mb-2" />
                          <span className="d-block fs-eight n3-clr">{t('LOTTERY_DETAILS.sold', 'Vendidos')}</span>
                          <span className="fw_700 act4-clr">{soldPercent}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="n4-clr fw_600">{t('LOTTERY_DETAILS.soldProgress', 'Progreso de venta')}</span>
                        <span className="act4-clr fw_700">{soldPercent}%</span>
                      </div>
                      <div
                        className="position-relative"
                        style={{
                          background: 'rgba(0, 229, 255, 0.2)',
                          height: '8px',
                          borderRadius: '4px',
                          width: '100%',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${soldPercent}%`,
                            background: 'var(--s1)',
                            borderRadius: '4px',
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </div>
                    </div>

                    {/* Terms */}
                    {lotteryTerms && (
                      <div className="mb-4">
                        <h4 className="n4-clr fw_700 mb-3">{t('LOTTERY_DETAILS.terms', 'Términos y Condiciones')}</h4>
                        <div className="n0-bg radius12 p-4">
                          <p className="n3-clr fs-seven" style={{ whiteSpace: 'pre-line' }}>
                            {lotteryTerms}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Age Restriction Warning */}
                    {lottery.hasAgeRestriction && (
                      <div className="alert alert-warning d-flex align-items-center gap-3" role="alert">
                        <span className="fs-four">⚠️</span>
                        <div>
                          <strong>{t('LOTTERY_DETAILS.ageRestriction', 'Restricción de edad')}:</strong>{' '}
                          {t('LOTTERY_DETAILS.minimumAge', 'Debes tener al menos')} {lottery.minimumAge || 18}{' '}
                          {t('LOTTERY_DETAILS.years', 'años')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </MotionFade>
            </div>

            {/* Right Column - Buy Tickets */}
            <div className="col-lg-4">
              <MotionFade>
                <div className="ans-qustion-wrap position-sticky" style={{ top: '100px' }}>
                  {/* Price Header */}
                  <div className="ans-title p-xxl-5 p-4 text-center">
                    <span className="d-block fs-eight n3-clr mb-1">
                      {t('LOTTERY_DETAILS.pricePerTicket', 'Precio por ticket')}
                    </span>
                    <h2 className="act4-clr fw_700">${lottery.ticketPrice.toFixed(2)}</h2>
                  </div>

                  <div className="p-xxl-5 p-4">
                    {/* Number Selection Grid */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <label className="n4-clr fw_600" style={{ fontSize: '13px' }}>
                            {isPick3
                              ? t('LOTTERY_DETAILS.pick3Title', 'Escoge tu número')
                              : t('LOTTERY_DETAILS.selectNumbers', 'Selecciona tus números')}
                          </label>
                          {/* Indicador de conexión WebSocket */}
                          {isAuthenticated && (
                            <span
                              title={isConnected ? 'Tiempo real activo' : 'Conectando...'}
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: isConnected ? 'var(--p1)' : 'var(--act3)',
                                display: 'inline-block',
                                animation: isConnected ? 'none' : 'pulse 1.5s infinite',
                              }}
                            />
                          )}
                        </div>
                        {selectedEntries.length > 0 && (
                          <button
                            className="btn btn-sm n3-clr p-0"
                            onClick={clearSelection}
                            style={{ fontSize: '11px' }}
                          >
                            {t('LOTTERY_DETAILS.clearAll', 'Limpiar')}
                          </button>
                        )}
                      </div>

                      {/* Error del hub */}
                      {hubError && (
                        <div className="alert alert-warning py-2 mb-2" style={{ fontSize: '11px' }}>
                          {hubError}
                          <button className="btn-close btn-sm ms-2" onClick={clearError} aria-label="Cerrar" />
                        </div>
                      )}

                      {/* Pick3: single 3-digit input / Standard: Number Grid */}
                      {isPick3 ? (
                        <div className="pick3-selector text-center">
                          <p className="n3-clr mb-3" style={{ fontSize: '12px' }}>
                            {t('LOTTERY_DETAILS.pick3Help', 'Escribe tu número de 3 dígitos (000 al 999)')}
                          </p>
                          {(() => {
                            const numValue = parseInt(pick3Number, 10);
                            const isValid = pick3Number !== '' && !isNaN(numValue) && numValue >= 0 && numValue <= 999;
                            const numberInfo = isValid
                              ? availableNumbers.find(n => n.number === numValue)
                              : null;
                            const isAvailable = numberInfo ? numberInfo.availableSeries > 0 : isValid;
                            const isSoldOut = numberInfo ? numberInfo.isExhausted : false;
                            return (
                              <div className="d-flex flex-column align-items-center gap-3">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={3}
                                  value={pick3Number}
                                  onChange={e => {
                                    const val = e.target.value;
                                    if (val === '' || /^\d{1,3}$/.test(val)) {
                                      setPick3Number(val);
                                    }
                                  }}
                                  onBlur={() => {
                                    if (pick3Number !== '') {
                                      const num = parseInt(pick3Number, 10);
                                      if (!isNaN(num) && num >= 0 && num <= 999) {
                                        setPick3Number(num.toString().padStart(3, '0'));
                                      }
                                    }
                                  }}
                                  placeholder="000"
                                  className="form-control text-center fw_700"
                                  style={{
                                    fontSize: '36px',
                                    letterSpacing: '12px',
                                    height: '64px',
                                    maxWidth: '200px',
                                    borderRadius: '12px',
                                    backgroundColor: 'var(--bg2)',
                                    color: isValid ? (isSoldOut ? 'var(--act1)' : 'var(--p1)') : '#fff',
                                    border: isSoldOut
                                      ? '2px solid var(--act1)'
                                      : isValid && isAvailable
                                        ? '2px solid var(--p1)'
                                        : '1px solid #444',
                                  }}
                                />
                                {/* Visual badge */}
                                <div
                                  className="fw_700"
                                  style={{
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    background: isValid
                                      ? isSoldOut
                                        ? 'linear-gradient(135deg, var(--act1), #c44569)'
                                        : 'linear-gradient(135deg, var(--p1), #00b45a)'
                                      : 'var(--bg2)',
                                    color: isValid && !isSoldOut ? 'var(--n4)' : '#fff',
                                    fontSize: '24px',
                                    letterSpacing: '6px',
                                    minWidth: '120px',
                                    transition: 'all 0.3s ease',
                                  }}
                                >
                                  {isValid ? numValue.toString().padStart(3, '0') : '---'}
                                </div>
                                <p className="mb-0" style={{ fontSize: '12px' }}>
                                  {isValid ? (
                                    isSoldOut ? (
                                      <span style={{ color: 'var(--act1)' }}>
                                        ✗ {t('LOTTERY_DETAILS.pick3Unavailable', 'Número no disponible, intenta otro')}
                                      </span>
                                    ) : isAvailable ? (
                                      <span style={{ color: 'var(--p1)' }}>
                                        ✓ {t('LOTTERY_DETAILS.pick3Available', '¡Número disponible!')}
                                      </span>
                                    ) : (
                                      <span style={{ color: 'var(--p1)' }}>
                                        ✓ {t('LOTTERY_DETAILS.pick3Ready', '¡Número seleccionado!')}
                                      </span>
                                    )
                                  ) : (
                                    <span className="n3-clr">
                                      {t('LOTTERY_DETAILS.pick3Waiting', 'Ingresa un número de 3 dígitos')}
                                    </span>
                                  )}
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                      ) : (
                        <>
                          {/* Buscador de números (rangos grandes) */}
                          {totalNumbers > NUMBERS_PAGE_SIZE && (
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={numberDigits}
                              value={numberSearch}
                              onChange={e => {
                                const val = e.target.value;
                                if (val === '' || new RegExp(`^\\d{1,${numberDigits}}$`).test(val)) {
                                  setNumberSearch(val);
                                }
                              }}
                              placeholder={t('LOTTERY_DETAILS.searchNumber', 'Busca tu número, ej. 7575')}
                              className="form-control form-control-sm mb-2"
                              aria-label={t('LOTTERY_DETAILS.searchNumber', 'Busca tu número, ej. 7575')}
                            />
                          )}

                          {/* Numbers Grid - Compacto sin scroll */}
                          <div
                            className="number-grid"
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(10, 1fr)',
                              gap: '2px',
                            }}
                          >
                            {visibleNumbers.map(num => {
                              const qty = selectedNumbers[num] || 0;
                              const isSelected = qty > 0;
                              const hubNumber = availableByNumber.get(num);
                              const isExhausted = hubNumber?.isExhausted ?? false;
                              const availableSeries = hubNumber?.availableSeries ?? lottery.totalSeries;

                              let buttonClass = 'n0-bg n4-clr border';
                              if (isExhausted) buttonClass = 'n2-bg n3-clr';
                              else if (isSelected) buttonClass = 'act4-bg n0-clr';

                              let buttonTitle = '';
                              if (isExhausted) buttonTitle = 'Agotado';
                              else if (isConnected) buttonTitle = `${availableSeries} series disponibles`;

                              return (
                                <button
                                  key={num}
                                  onClick={() => !isExhausted && handleNumberClick(num)}
                                  disabled={isExhausted}
                                  className={`btn p-0 ${buttonClass}`}
                                  style={{
                                    width: '100%',
                                    height: '28px',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    borderRadius: '4px',
                                    position: 'relative',
                                    opacity: isExhausted ? 0.5 : 1,
                                    cursor: isExhausted ? 'not-allowed' : 'pointer',
                                  }}
                                  title={buttonTitle}
                                >
                                  {formatNumber(num)}
                                  {qty > 1 && (
                                    <span
                                      style={{
                                        position: 'absolute',
                                        top: '-4px',
                                        right: '-4px',
                                        background: 'var(--act1)',
                                        color: '#fff',
                                        fontSize: '8px',
                                        fontWeight: 700,
                                        borderRadius: '50%',
                                        width: '14px',
                                        height: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      {qty}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Sin resultados de búsqueda */}
                          {isSearching && visibleNumbers.length === 0 && (
                            <p className="n3-clr text-center my-2 mb-0" style={{ fontSize: '12px' }}>
                              {t('LOTTERY_DETAILS.noNumbersFound', 'No hay números que coincidan con la búsqueda')}
                            </p>
                          )}

                          {/* Controles de paginación */}
                          {!isSearching && totalNumberPages > 1 && (
                            <div className="d-flex align-items-center justify-content-between mt-2">
                              <button
                                className="btn btn-sm n0-bg n4-clr border"
                                onClick={() => setNumberPage(p => Math.max(0, p - 1))}
                                disabled={numberPage === 0}
                                style={{ fontSize: '12px', padding: '2px 10px' }}
                                aria-label={t('LOTTERY_DETAILS.prevPage', 'Página anterior')}
                              >
                                ‹
                              </button>
                              <span className="n3-clr" style={{ fontSize: '11px' }}>
                                {pageRangeLabel} · {numberPage + 1}/{totalNumberPages}
                              </span>
                              <button
                                className="btn btn-sm n0-bg n4-clr border"
                                onClick={() => setNumberPage(p => Math.min(totalNumberPages - 1, p + 1))}
                                disabled={numberPage >= totalNumberPages - 1}
                                style={{ fontSize: '12px', padding: '2px 10px' }}
                                aria-label={t('LOTTERY_DETAILS.nextPage', 'Página siguiente')}
                              >
                                ›
                              </button>
                            </div>
                          )}

                          {/* Selected Numbers with Quantity Control */}
                          {selectedEntries.length > 0 && (
                            <div className="mt-3 p-2 n0-bg radius8">
                              <span className="fs-nine n3-clr d-block mb-2">
                                {t('LOTTERY_DETAILS.selectedNumbers', 'Seleccionados')}:
                              </span>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {selectedEntries
                                  .toSorted(([a], [b]) => Number(a) - Number(b))
                                  .map(([num, qty]) => {
                                    const available = getAvailableSeries(Number(num));
                                    const isAtMax = qty >= available;

                                    return (
                                      <div
                                        key={num}
                                        className="d-flex align-items-center justify-content-between"
                                        style={{ fontSize: '12px' }}
                                      >
                                        <div className="d-flex align-items-center gap-2">
                                          <span className="fw_700 act4-clr">{formatNumber(Number(num))}</span>
                                          <span className="text-muted" style={{ fontSize: '10px' }}>
                                            ({qty}/{available})
                                          </span>
                                        </div>
                                        <div className="d-flex align-items-center gap-1">
                                          <button
                                            className="btn p-0 n4-clr"
                                            onClick={() => decreaseQuantity(Number(num))}
                                            style={{ width: '20px', height: '20px', fontSize: '14px', lineHeight: 1 }}
                                          >
                                            −
                                          </button>
                                          <span className="fw_600 n4-clr" style={{ minWidth: '20px', textAlign: 'center' }}>
                                            {qty}
                                          </span>
                                          <button
                                            className="btn p-0"
                                            onClick={() => increaseQuantity(Number(num))}
                                            disabled={isAtMax}
                                            style={{
                                              width: '20px',
                                              height: '20px',
                                              fontSize: '14px',
                                              lineHeight: 1,
                                              opacity: isAtMax ? 0.3 : 1,
                                              cursor: isAtMax ? 'not-allowed' : 'pointer',
                                            }}
                                            title={isAtMax ? t('LOTTERY_DETAILS.maxSeriesReached', 'Límite alcanzado') : ''}
                                          >
                                            +
                                          </button>
                                          <button
                                            className="btn p-0 n3-clr ms-1"
                                            onClick={() => removeNumber(Number(num))}
                                            style={{ width: '20px', height: '20px', fontSize: '12px', lineHeight: 1 }}
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Total */}
                    <div className="n0-bg radius12 p-4 mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="n3-clr">{t('LOTTERY_DETAILS.quantity', 'Cantidad')}:</span>
                        <span className="n4-clr fw_600">
                          {ticketQuantity} {ticketQuantity === 1 ? 'número' : 'números'}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="n3-clr">{t('LOTTERY_DETAILS.unitPrice', 'Precio unitario')}:</span>
                        <span className="n4-clr fw_600">${lottery.ticketPrice.toFixed(2)}</span>
                      </div>
                      <hr className="my-3" />
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="n4-clr fw_700 fs-five">{t('LOTTERY_DETAILS.total', 'Total')}:</span>
                        <span className="act4-clr fw_700 fs-four">${totalPrice}</span>
                      </div>
                    </div>

                    {/* Buy Button */}
                    <button
                      className="kewta-btn d-flex align-items-center justify-content-center w-100 mb-3"
                      disabled={
                        lottery.status !== LotteryStatus.Active ||
                        remaining === 0 ||
                        ticketQuantity === 0 ||
                        isReserving ||
                        !isAuthenticated ||
                        !isConnected ||
                        isPick3Unavailable
                      }
                      onClick={handleBuyNow}
                    >
                      <span className="kew-text p1-bg n4-clr d-flex align-items-center justify-content-center gap-2 w-100">
                        {isReserving ? (
                          <>
                            <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                            {t('LOTTERY_DETAILS.reserving', 'Reservando...')}
                          </>
                        ) : (
                          <>
                            <ShoppingCartIcon className="fs-five" weight="bold" />
                            {t('LOTTERY_DETAILS.buyNow', 'Comprar Ahora')}
                          </>
                        )}
                      </span>
                    </button>

                    {/* Add to Cart Button */}
                    <button
                      className="kewta-btn d-flex align-items-center justify-content-center w-100"
                      disabled={isAddToCartDisabled}
                      onClick={handleAddToCart}
                    >
                      <span className="kew-text n0-bg n4-clr border d-flex align-items-center justify-content-center gap-2 w-100">
                        {isReserving && (
                          <>
                            <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                            {t('LOTTERY_DETAILS.reserving', 'Reservando...')}
                          </>
                        )}
                        {!isReserving && !isAuthenticated && (
                          <>
                            <TagIcon className="fs-five" weight="bold" />
                            {t('AUTH.loginToBuy', 'Inicie sesión para comprar')}
                          </>
                        )}
                        {!isReserving && isAuthenticated && (
                          <>
                            <TagIcon className="fs-five" weight="bold" />
                            {t('LOTTERY_DETAILS.addToCart', 'Agregar al Carrito')}
                          </>
                        )}
                      </span>
                    </button>

                    {/* Login Required Message */}
                    {!isAuthenticated && (
                      <div className="alert alert-info mt-3 py-2 text-center" style={{ fontSize: '12px' }}>
                        <a href="/login" className="text-decoration-underline">
                          {t('AUTH.loginRequired', 'Inicie sesión')}
                        </a>{' '}
                        {t('AUTH.toBuyTickets', 'para comprar boletos')}
                      </div>
                    )}

                    {/* Connection Warning */}
                    {!isConnected && isAuthenticated && (
                      <div className="alert alert-warning mt-3 py-2 text-center" style={{ fontSize: '12px' }}>
                        {t('LOTTERY_DETAILS.connecting', 'Conectando al servidor...')}
                      </div>
                    )}

                    {/* Sold Out Message */}
                    {remaining === 0 && (
                      <div className="alert alert-danger mt-3 text-center" role="alert">
                        <strong>{t('LOTTERY_DETAILS.soldOut', '¡Agotado!')}</strong>
                      </div>
                    )}

                    {/* Lottery Number Info */}
                    <div className="mt-4 text-center">
                      <span className="fs-eight n3-clr">
                        {t('LOTTERY_DETAILS.lotteryNo', 'Promoción No.')}{' '}
                        <strong className="n4-clr">{lottery.lotteryNo}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </MotionFade>
            </div>
          </div>
        </div>
      </section>

      <Jewellery1Footer />

      {/* Carrito de compras */}
      <CartButton />
      <CartSidebar />
    </div>
  );
};

export default LotteryDetailsPage;
