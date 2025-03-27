import { FaRegBell, FaWater } from "react-icons/fa";
import { MdOutlineSpa } from "react-icons/md";
import { RiPlantLine } from "react-icons/ri";
import './About.css';

const About = () => {
  return (
    <div className="about-section">
      <div className="title-container">
        <h1>About Smart Harvest</h1>
        <p>
          Our platform allows users to choose a plant and monitor its health through
          a personalized plant profile. Users receive real-time updates on humidity,
          light levels, and other essential statistics to ensure their plant thrives.
        </p>
      </div>

      <div className="paragraphs">
        <h2>What you can expect from our platform</h2>

        <div className="paragraph">
          <div className="icons">
            <RiPlantLine />
          </div>
          <div className="text">
            <h3>A personalized plant profile</h3>
            <p>
              Each plant has its own dedicated profile where users can track
              important metrics and ensure optimal growth conditions.
            </p>
          </div>
        </div>

        <div className="paragraph">
          <div className="icons">
            <FaRegBell />
          </div>
          <div className="text">
            <h3>Real-time notifications</h3>
            <p>
              If something is wrong—like low water levels or poor lighting—you
              will receive instant notifications to take action.
            </p>
          </div>
        </div>

        <div className="paragraph">
          <div className="icons">
            <FaWater />
          </div>
          <div className="text">
            <h3>Manual and Automatic Watering</h3>
            <p>
              Choose between manually watering your plants or letting our system
              automate the process to ensure optimal hydration levels.
            </p>
          </div>
        </div>

        <div className="paragraph">
          <div className="icons">
            <MdOutlineSpa />
          </div>
          <div className="text">
            <h3>Healthy and Thriving Plants</h3>
            <p>
              Our system helps maintain the perfect conditions for your plants,
              ensuring they grow strong and healthy with minimal effort.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;