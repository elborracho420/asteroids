import React, { useState, useEffect } from "react";
import "./App.css";

const AsteroidsGame = () => {
  const [player, setPlayer] = useState({
    x: 0,
    y: 0,
    angle: 0,
    velocity: { x: 0, y: 0 },
  });
  const [asteroids, setAsteroids] = useState([]);
  const [bullets, setBullets] = useState([]);

  useEffect(() => {
    // Game loop logic
    const gameLoop = () => {
      // Update game state here
      const xVelocity = player.velocity.x * 0.99;
      const yVelocity = player.velocity.y * 0.99;

      // Update the player state with the new velocity
      setPlayer((prevState) => ({
        ...prevState,
        x: prevState.x + xVelocity,
        y: prevState.y + yVelocity,
        velocity: { x: xVelocity, y: yVelocity },
      }));

      // Update the bullets state with new positions
      setBullets((prevState) =>
        prevState
          .map((bullet) => ({
            ...bullet,
            x: bullet.x + bullet.velocity.x,
            y: bullet.y + bullet.velocity.y,
            style: {
              ...bullet.style,
              color: "#fff",
            },
          }))
          .filter(
            (bullet) =>
              bullet.x > -400 &&
              bullet.x < 400 &&
              bullet.y > -300 &&
              bullet.y < 300 &&
              !asteroids.some((asteroid) => isColliding(bullet, asteroid))
          )
      );
    };

    //bullet impact collision / out of bounds handling:
    const isColliding = (a, b) => {
      const distance = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
      return distance < a.size / 2 + b.size / 2;
    };
    // Start game loop
    const intervalId = setInterval(gameLoop, 16);

    // Cleanup function
    return () => clearInterval(intervalId);
  }, []);

  const handleKeyDown = (event) => {
    // Update game state based on user input
    const { keyCode } = event;

    //left arrow key
    if (keyCode === 37) {
      setPlayer((prevState) => ({
        ...prevState,
        angle: prevState.angle - 17.5,
      }));
    }

      // Right arrow key
    if (keyCode === 39) {
      setPlayer((prevState) => ({
        ...prevState,
        angle: prevState.angle + 17.5,
      }));
    }

    // Up arrow key
  if (keyCode === 38) {
    const radians = (player.angle * Math.PI) / 180; // convert angle to radians
    const acceleration = 3.5; //adjust this value to change the ships acceleration
    const xVelocity = player.velocity.x + Math.sin(radians) * acceleration; // add to x velocity based on angle
    const yVelocity = player.velocity.y - Math.cos(radians) * acceleration; // add to y velocity based on angle
    const x = player.x + xVelocity; // calculate new x position
    const y = player.y + yVelocity; // calculate new y position

    setPlayer((prevState) => ({
      ...prevState,
      x: x,
      y: y,
      velocity: { x: xVelocity, y: yVelocity },
    }));
  }

  // Down arrow key
  if (keyCode === 40) {
    const radians = (player.angle * Math.PI) / 180; // convert angle to radians
    const xVelocity =
      player.velocity.x - Math.sin(radians) * 3.5; // subtract from x velocity based on angle
    const yVelocity =
      player.velocity.y + Math.cos(radians) * 3.5; // add to y velocity based on angle
    const x = player.x + xVelocity; // calculate new x position
    const y = player.y + yVelocity; // calculate new y position

    setPlayer((prevState) => ({
      ...prevState,
      x: x,
      y: y,
      velocity: { x: xVelocity, y: yVelocity },
    }));
  }

  // Space bar key
  if (keyCode === 32) {
    if (bullets.length < 5) { // limit the number of bullets on the screen
      const radians = (player.angle * Math.PI) / 180;
    const bulletSpeed = 7;
    const xVelocity = player.velocity.x + Math.sin(radians) * bulletSpeed;
    const yVelocity = player.velocity.y - Math.cos(radians) * bulletSpeed;
    const xOffset = Math.sin(radians) + 400; // add an offset to the x position
    const yOffset = -Math.cos(radians) + 250; // add an offset to the y position
    const x = player.x + xOffset; // calculate the new x position
    const y = player.y + yOffset; // calculate the new y position

    setBullets((prevState) => [
      ...prevState,
      { id: Date.now(), x, y, velocity: { x: xVelocity, y: yVelocity } },
    ]);
    }
  }
  };

  return (
    <div
      id="container"
      style={{
        position: "absolute",
        width: "800px",
        height: "600px",
        backgroundColor: "#000",
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        id="ship"
        style={{
          position: "absolute",
          left: `${player.x + 400}px`,
          top: `${player.y + 280}px`,
          transform: `rotate(${player.angle}deg)`,
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderBottom: "30px solid white",
        }}
      />
      {asteroids.map((asteroid) => (
        <div
          key={asteroid.id}
          style={{
            position: "absolute",
            left: `${asteroid.x}px`,
            top: `${asteroid.y}px`,
            width: `${asteroid.size}px`,
            height: `${asteroid.size}px`,
            border: "1px solid #fff",
            borderRadius: "50%",
          }}
        />
      ))}
      {bullets.map(({ id, x, y }) => (
        <Bullet key={id} x={x} y={y} size={5} style={{ color: "#fff" }} />
      ))}
    </div>
  );
};

const Bullet = ({ x, y }) => {
  const bulletSize = 10;

  return (
    <div
      className="bullet"
      style={{
        position: "absolute",
        top: y - bulletSize / 2,
        left: x - bulletSize / 2,
        width: bulletSize,
        height: bulletSize,
        borderRadius: bulletSize / 2,
        backgroundColor: "#fff",
      }}
    />
  );
};

export default AsteroidsGame;