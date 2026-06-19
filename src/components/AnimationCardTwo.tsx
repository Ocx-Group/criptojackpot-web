'use client';
import Matter, { Bodies, Bounds, Engine, Events, Mouse, MouseConstraint, Render, Runner, World } from 'matter-js';
import { useEffect, useRef } from 'react';

const AnimationCardTwo = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const instance = useRef<Render | null>(null);
  const runnerRef = useRef<Runner | null>(null);

  useEffect(() => {
    const containerElement = canvasRef.current!;
    const containerWidth = containerElement.clientWidth;
    const containerHeight = containerElement.clientHeight;
    const engine = Engine.create();

    // Helper function to create bounds
    const createBounds = (containerWidth: number, containerHeight: number) => {
      return {
        ground: Bodies.rectangle(containerWidth / 2 + 160, containerHeight + 80, containerWidth + 320, 160, {
          render: { fillStyle: '#fff' },
          isStatic: true,
        }),
        wallLeft: Bodies.rectangle(-80, containerHeight / 2, 160, containerHeight, { isStatic: true }),
        wallRight: Bodies.rectangle(containerWidth + 80, containerHeight / 2, 160, 1200, { isStatic: true }),
        roof: Bodies.rectangle(containerWidth / 2 + 160, -80, containerWidth + 320, 160, { isStatic: true }),
      };
    };

    // Helper function to create sprite body
    const createSpriteBody = (
      x: number,
      y: number,
      width: number,
      height: number,
      texture: string,
      radius: number = 20
    ) => {
      return Bodies.rectangle(x, y, width, height, {
        chamfer: { radius },
        render: {
          sprite: {
            texture,
            xScale: 1,
            yScale: 1,
          },
        },
      });
    };

    // Helper function to create all categories
    const createCategories = (containerWidth: number) => {
      const centerX = containerWidth / 2;

      return [
        createSpriteBody(centerX + 150, 500, 164, 56, '/images/mattericon/t1.png'),
        createSpriteBody(centerX - 150, 460, 122, 56, '/images/mattericon/t2.png'),
        createSpriteBody(centerX + 250, 420, 204, 56, '/images/mattericon/t3.png'),
        createSpriteBody(centerX - 75, 380, 204, 56, '/images/mattericon/t4.png'),
        createSpriteBody(centerX - 74, 540, 194, 56, '/images/mattericon/t5.png'),
        createSpriteBody(centerX + 174, 490, 216, 56, '/images/mattericon/t6.png'),
        createSpriteBody(centerX - 142, 440, 167, 56, '/images/mattericon/t7.png'),
        createSpriteBody(centerX - 10, 260, 260, 56, '/images/mattericon/t8.png'),
        createSpriteBody(centerX - 242, 420, 174, 56, '/images/mattericon/t9.png'),
        createSpriteBody(centerX + 60, 300, 285, 56, '/images/mattericon/t10.png'),
        createSpriteBody(centerX, 320, 170, 56, '/images/mattericon/t11.png'),
        createSpriteBody(centerX - 59, 260, 60, 56, '/images/mattericon/t12.png'),
        createSpriteBody(centerX + 110, 260, 110, 56, '/images/mattericon/t13.png'),
      ];
    };

    // Helper function to check if mouse is over any body
    const findBodyUnderMouse = (bodies: Matter.Body[], mousePosition: Matter.Vector) => {
      return bodies.find(element => Bounds.contains(element.bounds, mousePosition));
    };

    // Helper function to setup mouse events
    const setupMouseEvents = (mouseConstraint: MouseConstraint, engine: Engine) => {
      let click = false;

      const handleMouseDown = () => (click = true);
      const handleMouseMove = () => (click = false);

      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);

      Events.on(mouseConstraint, 'mouseup', function (event) {
        if (!click) return;

        const mouseConstraint = event.source;
        const bodies = engine.world.bodies;
        const bodyUnderMouse = findBodyUnderMouse(bodies, mouseConstraint.mouse.position);

        if (bodyUnderMouse) {
          // Handle body click
        }
      });

      return () => {
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
      };
    };

    if (canvasRef.current && !instance.current) {
      instance.current = Render.create({
        element: containerElement,
        engine: engine,
        options: {
          width: containerWidth,
          height: containerHeight,
          pixelRatio: 2,
          background: '#0B0E14',
          wireframes: false,
        },
      });
    }

    if (!instance.current) return;

    // Add the renderer to the DOM
    Render.run(instance.current);

    // add mouse control
    const mouse = Mouse.create(instance.current.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    // Create bounds and categories
    const bounds = createBounds(containerWidth, containerHeight);
    const categories = createCategories(containerWidth);

    // Add created bodies to the world
    World.add(engine.world, [mouseConstraint, ...Object.values(bounds), ...categories]);

    // Setup mouse events
    const cleanupMouseEvents = setupMouseEvents(mouseConstraint, engine);

    // Create and run the runner (modern way)
    runnerRef.current = Runner.create();
    Runner.run(runnerRef.current, engine);

    return () => {
      cleanupMouseEvents();
      if (instance.current) {
        Render.stop(instance.current);
      }
      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
      }
      Engine.clear(engine);
    };
  }, []);

  return <div ref={canvasRef} className="tags-container2 relative"></div>;
};

export default AnimationCardTwo;
