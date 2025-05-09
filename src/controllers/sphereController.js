import Sphere from '~/models/sphereModel';
import APIError from '~/utils/apiError';
import httpStatus from 'http-status';

// Получить все сферы пользователя
export const getMySpheres = async (req, res) => {
  const spheres = await Sphere.find({ userId: req.user.id });
  res.json({ success: true, data: spheres });
};

// Создать или обновить сферу
export const createOrUpdateSphere = async (req, res) => {
  const { name, value, criticality, frequency } = req.body;

  if (!name) {
    throw new APIError('Название сферы обязательно', httpStatus.BAD_REQUEST);
  }

  const sphere = await Sphere.findOneAndUpdate(
    { userId: req.user.id, name },
    {
      $set: {
        value: value ?? 5,
        criticality: criticality ?? 5,
        frequency: frequency ?? 'раз в неделю',
        lastUpdated: new Date()
      }
    },
    { upsert: true, new: true }
  );

  res.json({ success: true, data: sphere });
};

// Инициализация сфер при создании аккаунта
export const createInitialSpheres = async (userId) => {
  const defaultSpheres = [
    { name: 'Работа', value: 5, frequency: 'ежедневно', criticality: 3 },
    { name: 'Саморазвитие', value: 5, frequency: '5 дней в неделю', criticality: 4 },
    { name: 'Здоровье', value: 5, frequency: 'раз в 2 дня', criticality: 6 },
    { name: 'Семья', value: 5, frequency: 'раз в неделю', criticality: 7 },
    { name: 'Ценности', value: 5, frequency: 'раз в месяц', criticality: 8 }
  ];

  const spheres = defaultSpheres.map((s) => ({ ...s, userId }));
  await Sphere.insertMany(spheres);
};
