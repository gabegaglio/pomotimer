import settings from '../../assets/settings.svg';

const Settings = ({ onClick }) => {
  return (
    <button
      className="menuDiv w-fit hover:scale-110 transition duration-100 ease-in-out"
      onClick={onClick}
    >
      <img
        className="hover:scale-110 transition duration-100 ease-in-out cursor-pointer"
        id="settings"
        src={settings}
        alt="Settings Icon"
      />
    </button>
  );
};

export default Settings;
