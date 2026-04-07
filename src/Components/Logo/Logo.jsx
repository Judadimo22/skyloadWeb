import LogoImg from "../../assets/500x500(sin fondo).png";

export const Logo = ({ h = 35, w = 35 }) => {
  return (
    <div>
      <img src={LogoImg} style={{ height: h, width: w, objectFit: "contain" }} />
    </div>
  );
};