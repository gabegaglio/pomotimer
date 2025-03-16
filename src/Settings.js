import settings from './assets/settings.svg';

const Settings = ({ onClick }) => {
  return (
    <button className="menuDiv" onClick={onClick}>
      <img
        id="settings"
        src={settings}
        alt="Settings Icon"
      />
    </button>
  );
};

export default Settings;
