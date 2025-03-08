"use client";

import * as motion from "motion/react-client";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Variants({ admin }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  console.log(height);
  const nav1 = [
    { title: "Home", route: "/" },
    { title: "About Us", route: "/about" },
    { title: "Products", route: "/products" },
    { title: "Contact Us", route: "/contact" },
    { title: "Profile", route: "/profile" },
    { title: "Wishlist", route: "/wishlist" },
    { title: "Cart", route: "/cart" },
  ];
  if (admin) {
    nav1.push({ title: "DashBoard", route: "/dashboard" });
  }
  return (
    <div style={container}>
      <motion.nav
        initial={false}
        custom={height}
        animate={isOpen ? "open" : "closed"}
        ref={containerRef}
        style={nav}
      >
        <motion.div
          className="navBackGround"
          style={background}
          variants={sidebarVariants}
        />

        {/* {isOpen && ( */}
        <motion.ul style={list} variants={navVariants}>
          {nav1.map((p, i) => {
            const border = `2px solid #37bd9f`;
            return (
              <div key={i}>
                {isOpen && (
                  <motion.li
                    key={i}
                    initial={{
                      y: 50,
                      opacity: 0,
                      transition: {
                        y: { stiffness: 1000 },
                      },
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,

                      transition: {
                        y: { stiffness: 1000, velocity: -100 },
                      },
                    }}
                    exit={{
                      y: 50,
                      opacity: 0,
                      transition: {
                        y: { stiffness: 1000 },
                      },
                    }}
                    style={listItem}
                    variants={itemVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to={p.route} style={{ ...textPlaceholder, border }}>
                      {p.title}
                    </Link>
                  </motion.li>
                )}
              </div>
            );
          })}
        </motion.ul>
        {/* )} */}

        <button
          className="ssssvvvggg"
          style={toggleContainer}
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg color="red" width="23" height="23" viewBox="0 0 23 23">
            <Path
              variants={{
                closed: { d: "M 2 2.5 L 20 2.5" },
                open: { d: "M 3 16.5 L 17 2.5" },
              }}
            />
            <Path
              d="M 2 9.423 L 20 9.423"
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
              transition={{ duration: 0.1 }}
            />
            <Path
              variants={{
                closed: { d: "M 2 16.346 L 20 16.346" },
                open: { d: "M 3 2.5 L 17 16.346" },
              }}
            />
          </svg>
        </button>
      </motion.nav>
    </div>
  );
}

const navVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,

    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};
const nav = { width: 300 };
const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 50px 50px)",
    transition: {
      delay: 0.2,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const container = {
  position: "absolute",
  top: 0,
  left: 0,
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "stretch",
  flex: 1,
  width: 100,
  maxWidth: "100%",
  height: 100,
  backgroundColor: "var(--accent)",
  borderRadius: 20,
};

const background = {
  backgroundColor: "#f5f5f5",
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  width: 300,
};
const toggleContainer = {
  outline: "none",
  border: "none",
  cursor: "pointer",
  position: "absolute",
  top: 28,
  left: 25,
  width: 50,
  height: 50,
  borderRadius: "50%",
  background: "transparent",
};
const list = {
  listStyle: "none",
  padding: 25,
  margin: "0 auto",
  position: "absolute",
  top: 80,
  width: 300,
  maxWidth: "100vw",
};
const listItem = {
  color: "black",
  display: "flex",
  width: 246,
  maxWidth: "100%",
  padding: "0px 0px",
  alignItems: "center",
  marginBottom: 40,
  cursor: "pointer",
};

const textPlaceholder = {
  color: "black",
  borderRadius: 5,
  width: "100%",
  flex: 1,
  fontSize: "25px",
  fontWeight: "700",
  textAlign: "center",
  fontFamily: "var(--font-headding2)",
};

const useDimensions = (ref) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
};
