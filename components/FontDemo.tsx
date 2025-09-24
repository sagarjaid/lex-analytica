/** @format */

import React from "react";

const FontDemo = () => {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Font Demo</h2>
        <p className="mb-2">
          <strong>Bricolage Grotesque (Main Font):</strong> This is the default
          font used throughout the app.
        </p>
        <p className="text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      <div>
        <p className="mb-2">
          <strong>Playfair Display (Serif Font):</strong> Use this for special
          cases where you want a serif display font.
        </p>
        <p className="text-lg font-serif">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-bold mb-2">Regular Text</h3>
          <p>This uses Bricolage Grotesque by default</p>
        </div>
        <div className="p-4 border rounded-lg font-serif">
          <h3 className="font-bold mb-2">Serif Text</h3>
          <p>This uses Playfair Display with the font-serif class</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Usage Instructions:</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="mb-2">
            <strong>For default text:</strong> No additional class needed - uses
            Bricolage Grotesque
          </p>
          <p className="mb-2">
            <strong>For serif text:</strong> Add{" "}
            <code className="bg-white px-2 py-1 rounded">font-serif</code> class
          </p>
          <p>
            <strong>Tailwind class:</strong> You can also use{" "}
            <code className="bg-white px-2 py-1 rounded">font-serif</code> in
            Tailwind
          </p>
        </div>
      </div>
    </div>
  );
};

export default FontDemo;
