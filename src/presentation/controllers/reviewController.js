const { addFlash } = require('../flash/flashMessages');
function createReviewController(reviewCreationUseCase) {
    return {
        async create(req, res, next) {
            try {
                await reviewCreationUseCase.execute({
                    restaurantId: req.params.id,
                    userId: req.user.id,
                    rating: Number(req.body.rating),
                    text: req.body.text
                });
                addFlash(req, 'success', 'Review created successfully.');
                res.redirect(`/restaurants/${req.params.id}`);
            } catch (err) {
                next(err);
            }
        }
    };
}
module.exports = {
    createReviewController
};