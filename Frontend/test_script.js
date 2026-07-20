const techDeals = [
      { id: 'd1', brand: 'Nothing', name: 'Nothing Phone (4a) Pro - 12GB RAM, 256GB', price: '₹54,999', orig: '₹69,999', disc: '21%', img: '<svg width=\"60\" height=\"60\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#666\" stroke-width=\"1.5\"><rect x=\"5\" y=\"2\" width=\"14\" height=\"20\" rx=\"2\" ry=\"2\"/><line x1=\"12\" y1=\"18\" x2=\"12.01\" y2=\"18\"/></svg>' },
      { id: 'd2', brand: 'MorningBlues', name: 'SonicGlass A1 Transparent Speaker', price: '₹39,999', orig: '₹54,500', disc: '26%', img: '<svg width=\"60\" height=\"60\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#666\" stroke-width=\"1.5\"><rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\" ry=\"2\"/><circle cx=\"12\" cy=\"14\" r=\"4\"/><circle cx=\"12\" cy=\"6\" r=\"1\"/></svg>' },
      { id: 'd3', brand: 'Lenovo', name: 'ThinkTab X11 Rugged Tablet - 11\" 2.5K', price: '₹34,999', orig: '₹42,000', disc: '16%', img: '<svg width=\"60\" height=\"60\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#666\" stroke-width=\"1.5\"><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" ry=\"2\"/><line x1=\"12\" y1=\"18\" x2=\"12.01\" y2=\"18\"/></svg>' },
      { id: 'd4', brand: 'Realme', name: 'Realme P4 Power - 6000mAh Battery', price: '₹22,999', orig: '₹28,999', disc: '20%', img: '<svg width=\"60\" height=\"60\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#666\" stroke-width=\"1.5\"><rect x=\"5\" y=\"2\" width=\"14\" height=\"20\" rx=\"2\" ry=\"2\"/><line x1=\"12\" y1=\"18\" x2=\"12.01\" y2=\"18\"/></svg>' }
    ];

    const fashionDeals = [
      { id: 'd5', brand: 'Zara', name: 'Pre-Draped Silk Blend Saree', price: '₹2,499', orig: '₹5,999', disc: '58%', img: '<svg width=\"60\" height=\"60\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#666\" stroke-width=\"1.5\"><path d=\"M20.38 3.46L16 2a8 8 0 0 1-8 8v1.5a8 8 0 0 1-5.33 7.5L2 22l6-2a8 8 0 0 0 5.33-7.5V11a8 8 0 0 0 7.05-7.54z\"/></svg>' },
      { id: 'd6', brand: 'H&M', name: 'Eco-conscious Athleisure Co-ord Set', price: '₹1,299', orig: '₹2,999', disc: '56%', img: '<svg width=\"60\" height=\"60\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#666\" stroke-width=\"1.5\"><path d=\"M20.38 3.46L16 2a8 8 0 0 1-8 8v1.5a8 8 0 0 1-5.33 7.5L2 22l6-2a8 8 0 0 0 5.33-7.5V11a8 8 0 0 0 7.05-7.54z\"/></svg>' },
      { id: 'd7', brand: 'Levis', name: 'Soft Tailoring Wide Leg Trousers', price: '₹1,899', orig: '₹3,499', disc: '45%', img: '<svg width=\"60\" height=\"60\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#666\" stroke-width=\"1.5\"><path d=\"M20.38 3.46L16 2a8 8 0 0 1-8 8v1.5a8 8 0 0 1-5.33 7.5L2 22l6-2a8 8 0 0 0 5.33-7.5V11a8 8 0 0 0 7.05-7.54z\"/></svg>' },
      { id: 'd8', brand: 'Nike', name: 'Air Zoom Pegasus 41', price: '₹6,499', orig: '₹10,999', disc: '40%', img: '<svg width=\"60\" height=\"60\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#666\" stroke-width=\"1.5\"><path d=\"M20.38 3.46L16 2a8 8 0 0 1-8 8v1.5a8 8 0 0 1-5.33 7.5L2 22l6-2a8 8 0 0 0 5.33-7.5V11a8 8 0 0 0 7.05-7.54z\"/></svg>' }
    ];

    const homeDeals = [
      { id: 'd9', brand: 'Vaaree', name: 'Black Spiral Ceramic Vase', price: '₹899', orig: '₹2,499', disc: '64%', img: '<svg width=\"60\" height=\"60\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#666\" stroke-width=\"1.5\"><path d=\"M6 2L18 2M8 22L16 22M10 2L8 8C8 12 6 16 6 18C6 20 8 22 10 22M14 2L16 8C16 12 18 16 18 18C18 20 16 22 14 22\"/></svg>' },
      { id: 'd10', brand: 'Pepperfry', name: 'Ribbed Cream Planter (Set of 2)', price: '₹1,199', orig: '₹3,000', disc: '60%', img: '<svg width=\"60\" height=\"60\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#666\" stroke-width=\"1.5\"><path d=\"M8 22h8c2.5 0 3-2 3-5L17 5H7L5 17c0 3 .5 5 3 5zM5 5h14v3H5z\"/></svg>' },
      { id: 'd11', brand: 'Urban Ladder', name: 'Minimalist Metal Wall Clock', price: '₹1,499', orig: '₹3,599', disc: '58%', img: '<svg width=\"60\" height=\"60\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#666\" stroke-width=\"1.5\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"12\" y1=\"6\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"12\" x2=\"16\" y2=\"14\"/></svg>' },
      { id: 'd12', brand: 'Philips', name: 'Smart Air Purifier Diffuser combo', price: '₹8,999', orig: '₹14,999', disc: '40%', img: '<svg width=\"60\" height=\"60\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#666\" stroke-width=\"1.5\"><rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\" ry=\"2\"/><line x1=\"12\" y1=\"18\" x2=\"12.01\" y2=\"18\"/></svg>' }
    ];

    function generateCards(arr) {
      let wl = [];
      const res = arr.map(p => {
        const pStr = encodeURIComponent(JSON.stringify(p));
        const inWl = wl.some(w => w.id === p.id);
        const stroke = inWl ? 'none' : 'currentColor';
        const fill = inWl ? '#ef4444' : 'none';
        
        return \`
        <article class=\"cat-card\">
          <div class=\"cat-img-box\">
            <span class=\"deal-badge\">\${p.disc} OFF</span>
            <button class=\"wl-btn \${inWl ? 'active' : ''}\" onclick=\"toggleWishlist(this, '\${pStr}')\" aria-label=\"Toggle wishlist\">
              <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"\${fill}\" stroke=\"\${stroke}\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/></svg>
            </button>
            \${p.img}
          </div>
          <div class=\"cat-brand\">\${p.brand}</div>
          <div class=\"cat-name\">\${p.name}</div>
          <div class=\"cat-prices\"><span class=\"cat-price\">\${p.price}</span><span class=\"cat-orig\">\${p.orig}</span></div>
          <button class=\"cat-add-btn\" onclick=\"addToCart('\${pStr}')\">+ Add to Cart</button>
        </article>\`;
      }).join('');
      console.log('generated length', res.length);
    }

    generateCards(techDeals);
    generateCards(fashionDeals);
    generateCards(homeDeals);
