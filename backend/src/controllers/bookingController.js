import Booking from '../models/bookingModel.js';

export const getBookings = async (req, res) => {
  try {
    console.log("Получаем брони для пользователя", req.user.id);
    const bookings = await Booking.find({ user: req.user.id }).populate('show');
    res.json(bookings);
  } catch (error) {
    console.error("Ошибка при получении броней", error);
    res.status(500).json({ message: "Ошибка при получении броней", error });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { show, seatType } = req.body;
    console.log("Данные для создания бронирования:", req.body);

    if (!show || !seatType) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }

    const booking = new Booking({
      user: req.user.id,
      show,
      seatType,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error("Ошибка при создании бронирования", error);
    res.status(500).json({ message: 'Ошибка при создании бронирования' });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }

    if (booking.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Нет доступа' });
    }

    await booking.deleteOne();
    res.json({ message: 'Бронирование удалено' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении бронирования' });
  }
};