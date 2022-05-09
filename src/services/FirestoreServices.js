import { app } from "../../firebase";

const firestore = app.firestore();

export const guardarFotoEnCollection = async (coleccion, docName, foto) => {
  return await firestore.collection(coleccion).doc(docName).set(foto);
};
export const getAllFotosByEmail = async (coleccion, email, tipo, onResult, onError) => {
  return await firestore
    .collection(coleccion)
    .where("email", "==", email)
    .where("tipo", "==", tipo)
    .onSnapshot(onResult, onError);
};

export const getAllFotos = async (coleccion, tipo, onResult, onError) => {
  return await firestore.collection(coleccion).where("tipo", "==", tipo).onSnapshot(onResult, onError);
};
export const updateVotos = async (coleccion, doc, email, votosAnteriores) => {
  const votosActualizados = [...votosAnteriores, email];
  return await firestore.collection(coleccion).doc(doc).update({
    votos: votosActualizados,
  });
};
